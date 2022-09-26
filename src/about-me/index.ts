import { makeGqlEndpoint } from "../framework/gql/make-gql-endpoint"
import { makeGqlMiddleware } from "../framework/gql/make-gql-middleware"
import { GQLModule } from "../framework/gql/types"
import { requireJwtUser } from "../framework/modules/jwt-user-module"
import { ApplicationContext } from "../framework/types"
import { AboutMeServices } from "../types"

const createAboutMe = (services: AboutMeServices): GQLModule => ({
    schema: `
        type Person {
            id: String,
            type: String,
            firstName: String,
            lastName: String,
        }
        type Query {
            me: Person
        }
        `,
    resolvers: {
        Query: {
            // https://www.graphql-tools.com/docs/resolvers
            me: ({ctx: {user}}) => {
                return {
                    id: user.id,
                    type: 'person',
                    firstName: 'John',
                    lastName: 'Doe'
                }
            }
        }
    }
})

/** Expose About Me GraphQL api */
const aboutMeModule = (services: AboutMeServices) => ({registerKoaApi}: ApplicationContext) => registerKoaApi({
    aboutMeGql: requireJwtUser(makeGqlMiddleware(makeGqlEndpoint(createAboutMe(services))))
})

export default aboutMeModule
