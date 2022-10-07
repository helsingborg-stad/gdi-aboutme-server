import { createAuthorizationServiceFromEnv } from '@helsingborg-stad/gdi-api-node'
import { AboutMeServices } from '../types'
import { createPersonRepositoryFromEnv } from './person/repositories/index'

export const createServicesFromEnv = (): AboutMeServices => ({
	authorization: createAuthorizationServiceFromEnv(),
	persons: createPersonRepositoryFromEnv(),
})