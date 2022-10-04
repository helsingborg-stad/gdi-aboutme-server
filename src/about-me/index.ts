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
			type: String!,
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
	resolvers: {
		Query: {
			// https://www.graphql-tools.com/docs/resolvers
			me: ({ ctx: { user } }) => {
				return {
					id: user.id,
					type: 'person',
					firstName: 'John',
					lastName: 'Doe',
				}
			},
		},
		Mutation: {
			updateMe: ({ ctx: { user: { id } }, args: { me } }) => services.persons.updatePerson(id, me),
		},
	},
})

/** Expose About Me GraphQL api */
export const aboutMeModule = (services: AboutMeServices): ApplicationModule => ({ registerKoaApi }: ApplicationContext) => registerKoaApi({
	aboutMeGql: requireJwtUser(makeGqlMiddleware(makeGqlEndpoint(createAboutMe(services)))),
})
