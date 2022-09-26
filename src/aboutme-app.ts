import aboutMeModule from './about-me'
import { createApplication } from './framework'
import { healthCheckModule } from './framework/modules/healthcheck-module.ts'
import { jwtUserModule } from './framework/modules/jwt-user-module'
import swaggerModule from './framework/modules/swagger-module'
import webFrameworkModule from './framework/modules/web-framework-module'
import { Application } from './framework/types'
import { AboutMeServices } from './types'

export const createAboutMeApp = ({ services, validateResponse }: {services: AboutMeServices, validateResponse?: boolean}): Application =>
	createApplication({
		openApiDefinitionPath: './openapi.yml',
		validateResponse,
	})
		.use(webFrameworkModule())
		.use(swaggerModule())
		.use(jwtUserModule(services.authorization))
		.use(healthCheckModule())
		.use(aboutMeModule(services))
