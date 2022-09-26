export const healthCheckModule = (checkHealth?: ((namespace: string) => Promise<any> | any )) => ({registerKoaApi}) => registerKoaApi({
    healthCheck: async ctx => {
        const {params: {namespace}} = ctx
        const hc = await checkHealth?.(namespace)

        ctx.body = {
            status: 'ok',
            namespace,
            ...hc
        }
    }
})