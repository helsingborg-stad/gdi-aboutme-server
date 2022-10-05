import { makeGqlEndpoint } from '@helsingborg-stad/gdi-api-node/graphql'
import { makeGqlMiddleware } from '@helsingborg-stad/gdi-api-node/graphql'
import { GraphQLModule } from '@helsingborg-stad/gdi-api-node/graphql'
import { requireJwtUser } from '@helsingborg-stad/gdi-api-node/modules/jwt-user'
import { ApplicationContext, ApplicationModule } from '@helsingborg-stad/gdi-api-node/application'
import { AboutMeServices } from '../types'

export const createAboutMe = (services: AboutMeServices): GraphQLModule => ({
	schema: `
		scalar Date

		input PersonInput {
			email: String
		}
		type PersonEmail {
			address: String!,
			isVerified: Boolean!,
			verifiedDate: Date
		}
		type Person {
			id: String!,
			type: String,
			firstName: String,
			lastName: String,
			email: PersonEmail
		}
		type Query {
			me: Person
		}
		type Mutation {
			updateMe(me: PersonInput): Person
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
			}),
		},
		Mutation: {
			updateMe: async ({ ctx: { user: { id, firstName, lastName } }, args: { me } }) => services.persons.updatePerson(id, me, () => ({ id, firstName, lastName, type: 'person' })),
		},
	},
})

/** Expose About Me GraphQL api */
export const aboutMeGraphQLModule = (services: AboutMeServices): ApplicationModule => ({ registerKoaApi }: ApplicationContext) => registerKoaApi({
	aboutMeGql: requireJwtUser(makeGqlMiddleware(makeGqlEndpoint(createAboutMe(services)))),
})
