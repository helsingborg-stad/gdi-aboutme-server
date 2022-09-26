import path = require("path")
import * as Koa from 'koa'
import { createApplication } from "../application"
import swaggerModule from "../modules/swagger-module"
import webFrameworkModule from "../modules/web-framework-module"
import { ApplicationContext, ApplicationModule } from "../types"

const silentErrorsModule = (): ApplicationModule => ({app}) => app.on('error', () => {})

const createTestApp = () => createApplication({
    openApiDefinitionPath: path.join(__dirname, './test-app.openapi.yml'),
    validateResponse: true
})
    .use(silentErrorsModule())
    .use(webFrameworkModule())
    .use(swaggerModule())

const registerTestApi = (handlers: Record<string, Koa.Middleware>) => ({registerKoaApi}: ApplicationContext) => registerKoaApi(handlers)

export {
    createTestApp,
    registerTestApi
}