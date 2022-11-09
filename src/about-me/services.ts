import { createAuthorizationServiceFromEnv } from '@helsingborg-stad/gdi-api-node'
import { AboutMeServices } from '../types'
import { createPersonRepositoryFromEnv } from './person/repositories/index'
import { createGdiCasesServerFromEnv } from './external-providers/gdi-cases-server'

export const createServicesFromEnv = (): AboutMeServices => ({
	authorization: createAuthorizationServiceFromEnv(),
	persons: createPersonRepositoryFromEnv(),
	gdiCases: createGdiCasesServerFromEnv(),
})