import { createAuthorizationServiceFromEnv } from '../framework/services/authorization-service'
import { AboutMeServices } from '../types'
import { createPersonRepositoryFromEnv } from './person-repository'

export const createServicesFromEnv = (): AboutMeServices => ({
	authorization: createAuthorizationServiceFromEnv(),
	persons: createPersonRepositoryFromEnv(),
})