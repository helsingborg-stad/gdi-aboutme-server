import { getEnv } from "../../get-env"

const isDev = () => getEnv('NODE_ENV', {fallback: ''}) === 'development'

const getFallbackUserFromDev = (): any => isDev()
    ? JSON.parse(getEnv('DEVELOPMENT_FALLBACK_JWT_USER', {fallback: 'null'}))
    : null

export const fallbackUserModule = (fallbackUser: any = getFallbackUserFromDev()) => ({app}) => {
    if (fallbackUser && isDev()) {
        app.use(async (ctx, next) => {
            ctx.user = ctx.user || fallbackUser
            return next()
        })
    }
}
