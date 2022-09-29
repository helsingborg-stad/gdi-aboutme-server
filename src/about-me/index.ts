import { makeGqlEndpoint } from '../framework/gql/make-gql-endpoint'
import { makeGqlMiddleware } from '../framework/gql/make-gql-middleware'
import { GQLModule } from '../framework/gql/types'
import { requireJwtUser } from '../framework/modules/jwt-user-module'
import { ApplicationContext, ApplicationModule } from '../framework/types'
import { AboutMeServices } from '../types'

export const createAboutMe = (services: AboutMeServices): GQLModule => ({
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
