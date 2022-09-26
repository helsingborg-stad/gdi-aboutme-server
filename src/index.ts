
import { createServicesFromEnv } from './about-me/services'
import { createAboutMeApp } from './aboutme-app'
import { AboutMeServices } from './types'

const services: AboutMeServices = createServicesFromEnv()

/** Main entry point that start and runs web server */
createAboutMeApp({
	services,
	validateResponse: false,
})
	.start(process.env.PORT || 3000)
  