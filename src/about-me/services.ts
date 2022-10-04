import { createAuthorizationServiceFromEnv } from '@helsingborg-stad/gdi-api-node'
import { AboutMeServices } from '../types'
import { createPersonRepositoryFromEnv } from './person-repository'

export const createServicesFromEnv = (): AboutMeServices => ({
	authorization: createAuthorizationServiceFromEnv(),
	persons: createPersonRepositoryFromEnv(),
})