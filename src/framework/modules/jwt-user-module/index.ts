import * as Koa from 'koa'
import { AuthorizationService } from "../../services/authorization-service";
import { ApplicationContext } from "../../types";
import { getTokenFromAuthorizationHeader } from "./get-token-from-authorization-header";

export const jwtUserModule = (authorization: AuthorizationService) => ({ app, router, api }: ApplicationContext) => app.use(async (ctx, next) => {
    ctx.user = ctx.user || authorization.tryGetUserFromJwt(getTokenFromAuthorizationHeader(ctx.headers))
    return next()
})

export const requireJwtUser = (mv: Koa.Middleware): Koa.Middleware => (ctx, next) => ctx.user ? mv(ctx, next) : ctx.throw(401)
