import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphql } from 'graphql'
import { GQLEndpoint, GQLEndpointArgs, GQLModule, ResolverMap } from './types'


export function makeGqlEndpoint<TContext = any, TModel = any>({schema, resolvers}: GQLModule<TContext, TModel>): GQLEndpoint<TContext, TModel> {
    let es = makeExecutableSchema({
        typeDefs:schema,
        resolvers
    })

    return ({context, model, query, variables}: GQLEndpointArgs<TContext, TModel>) => graphql({
        schema: es,
        source: query,
        rootValue: model,
        contextValue: context,
        variableValues: variables
    })
}
