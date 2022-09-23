import { GQLEndpoint } from "./types"
const debug = require('debug')('application:gql-middleware')

export function makeGqlMiddleware<TContext, TModel>(
    endpoint: GQLEndpoint<TContext, TModel>,
    {
        mapQuery = q => q,
        mapVariables = v => v
    }: {
        mapQuery?: (q: any) => any,
        mapVariables?: (q: any) => any
    } = {}
    ){
    debug('creating middleware')
    return async ctx => {
        const {request: {body: {query, variables}}} = ctx
        let result = await endpoint({
            context: ctx,
            query: mapQuery(query),
            variables: mapVariables(variables)
        })
        ctx.body = result
    }
}