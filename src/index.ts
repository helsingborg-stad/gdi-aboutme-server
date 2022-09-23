
import { createServicesFromEnv } from './about-me/services'
import { createAboutMeApp } from './aboutme-app'
import { AboutMeServices } from './types'

const services: AboutMeServices = createServicesFromEnv()

createAboutMeApp({
	services,
	validateResponse: false,
})
	.start(process.env.PORT || 3000)
  