import { aboutMeModule } from './about-me'
import { createApplication } from './framework'
import { fallbackUserModule } from './framework/modules/fallback-user-module'
import { healthCheckModule } from './framework/modules/healthcheck-module.ts'
import { jwtUserModule } from './framework/modules/jwt-user-module'
import swaggerModule from './framework/modules/swagger-module'
import webFrameworkModule from './framework/modules/web-framework-module'
import { Application } from './framework/types'
import { AboutMeServices } from './types'

/** Create fully packaged About Me web application, given dependencies */
export const createAboutMeApp = ({ services, validateResponse }: {services: AboutMeServices, validateResponse?: boolean}): Application =>
	createApplication({
		openApiDefinitionPath: './openapi.yml',
		validateResponse,
	})
		.use(webFrameworkModule())
		.use(swaggerModule())
		.use(jwtUserModule(services.authorization))
		.use(fallbackUserModule())
		.use(healthCheckModule())
		.use(aboutMeModule(services))
