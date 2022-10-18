
import { createApplication } from '@helsingborg-stad/gdi-api-node'
import { healthCheckModule } from '@helsingborg-stad/gdi-api-node'
import { jwtUserModule } from '@helsingborg-stad/gdi-api-node'
import { swaggerModule } from '@helsingborg-stad/gdi-api-node'
import { webFrameworkModule } from '@helsingborg-stad/gdi-api-node'
import { Application } from '@helsingborg-stad/gdi-api-node/application'
import { AboutMeServices } from './types'
import { fallbackUserModule } from './about-me/fallback-user-module/index'
import { aboutMeGraphQLModule } from './about-me/about-me-graphql-module'
import { createHealthCheckFromServices } from './about-me/health-check/create-health-check-from-services'


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
		.use(healthCheckModule(createHealthCheckFromServices(services)))
		.use(aboutMeGraphQLModule(services))
