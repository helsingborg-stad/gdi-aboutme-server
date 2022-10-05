import * as jwt from 'jsonwebtoken'
import { createAboutMeApp } from '../../aboutme-app'
import { createAuthorizationService } from '@helsingborg-stad/gdi-api-node'
import { Application } from '@helsingborg-stad/gdi-api-node'
import { AboutMeServices } from '../../types'
import { createPersonRepositoryInMemory } from '../person/person-repository'

const TEST_SHARED_SCERET = 'a shared secret for the tests in this file'

const notImplemented = () => { throw new Error('not implemented') }

export const createTestServices = (services: Partial<AboutMeServices> = {}): AboutMeServices => ({
	authorization: {
		tryGetUserFromJwt: notImplemented,
	},
	persons: {
		getPerson: notImplemented,
		updatePerson: notImplemented,
	},
	...services,
})

export const createTestApp = (services: Partial<AboutMeServices> = {}): Application => createAboutMeApp({
	validateResponse: true,
	services: createTestServices({
		authorization: createAuthorizationService(TEST_SHARED_SCERET),
		persons: createPersonRepositoryInMemory({}),
		...services,
	}),
})

export const createAuthorizationHeadersFor = (id: string, secret: string = TEST_SHARED_SCERET): { authorization: string } => ({
	authorization: `Bearer ${jwt.sign({ id }, secret)}`,
})
