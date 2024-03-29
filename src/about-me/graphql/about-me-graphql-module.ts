import { makeGqlEndpoint } from '@helsingborg-stad/gdi-api-node/graphql'
import { makeGqlMiddleware } from '@helsingborg-stad/gdi-api-node/graphql'
import { GraphQLModule } from '@helsingborg-stad/gdi-api-node/graphql'
import { requireJwtUser } from '@helsingborg-stad/gdi-api-node/modules/jwt-user'
import { ApplicationContext, ApplicationModule } from '@helsingborg-stad/gdi-api-node/application'
import { AboutMeServices } from '../../types'


export const createAboutMe = (services: AboutMeServices): GraphQLModule => ({
	schema: `
		scalar Date

		type Case {
			recordId: String
			isMarkedAsRead: Boolean
			caseId: String
			subjectId: String
			updateTime: String
			organization: String
			label: String
			description: String
			status: String
			statusHint: String
			events: [CaseEvent]
			actions: [CaseAction]
		}
		type CaseEvent {
			updateTime: String
			label: String
			description: String
			status: String
			statusHint: String
			actions: [CaseAction]
		}
		type CaseAction {
			label: String
			url: String
			typeHint: String
		}
	


		input PersonInput {
			email: String
			phoneNumber: String
		}
		type PersonEmail {
			address: String!,
			isVerified: Boolean!,
			verifiedDate: Date
		}
		type PersonPhone {
			number: String!,
			isVerified: Boolean!,
			verifiedDate: Date
		}
		type Person {
			id: String!,
			type: String,
			firstName: String,
			lastName: String,
			email: PersonEmail
			phone: PersonPhone
			cases: [Case]
		}
		type Query {
			me: Person
		}
		type Mutation {
			updateMe(me: PersonInput): Person
			markCaseAsRead(recordId: String): Boolean
		}
		schema {
			query: Query
			mutation: Mutation
		}
		`,
	// https://www.graphql-tools.com/docs/resolvers
	resolvers: {
		Query: {
			me: async ({ ctx: { user: { id, firstName, lastName } } }) => ({
				id,
				type:'person',
				...await services.persons.getPerson(id, () => ({ id, firstName, lastName })),
				cases: async () => services.gdiCases?.listCasesBySubjectId(id) || [],
			}),
		},
		Mutation: {
			updateMe: async ({ ctx: { user: { id, firstName, lastName } }, args: { me } }) => ({
				id,
				type:'person',
				...await services.persons.updatePerson(id, me, () => ({ id, firstName, lastName, type: 'person' })),
				cases: async () => services.gdiCases?.listCasesBySubjectId(id) || [],
			}),
			markCaseAsRead: async ({ args: { recordId } }) => services.gdiCases?.markAsRead(recordId).then(()=> true) || false,
		},
	},
})

/** Expose About Me GraphQL api */
export const aboutMeGraphQLModule = (services: AboutMeServices): ApplicationModule => ({ registerKoaApi }: ApplicationContext) => registerKoaApi({
	aboutMeGql: requireJwtUser(makeGqlMiddleware(makeGqlEndpoint(createAboutMe(services)))),
})
