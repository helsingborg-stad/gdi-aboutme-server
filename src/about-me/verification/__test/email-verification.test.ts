import { Application, createAuthorizationService } from '@helsingborg-stad/gdi-api-node'
import { createInMemoryPersonRepository } from '../../person/repositories'
import { createAboutMeApp } from '../../../aboutme-app'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'

export const createTestApp = (db: object): Application => createAboutMeApp({
	validateResponse: true,
	services: {
		authorization: createAuthorizationService('test shared secret'),
		persons: createInMemoryPersonRepository(db),
	},
})

describe('email verification: GET /api/v1/aboutme/verify/email/{code}', () => {
	// wrap full request and return response
	const requestVerifyEmail = async (db: object, verificationCode: string) => {
		let result: ReturnType<request.get>
		await createTestApp(db)
			.run(async server => {
				result = await request(server)
					.get(`/api/v1/aboutme/verify/email/${verificationCode}`)
			})
		return result
	}

	it('ignores bad/missing codes and responds with {verified: false}', async () => {
		const { status, body } = await requestVerifyEmail({}, 'missing-verification-code')
		expect(status).toBe(StatusCodes.OK)
		expect(body).toMatchObject({
			verified: false,
		})
	})

	it('updates existing person and responds with {verified: true}', async () => {
		const db = {
			'test-id-1': {
				email: {
					address: 'a@b.com',
					verificationCode: 'test-verification-code',
					isVerified: false,
				},
			},
		}

		const { status, body } = await requestVerifyEmail(db, 'test-verification-code')
		expect(status).toBe(StatusCodes.OK)
		expect(body).toMatchObject({
			verified: true,
		})
		expect(db).toMatchObject({
			'test-id-1': {
				email: {
					address: 'a@b.com',
					verificationCode: 'test-verification-code',
					isVerified: true,
				},
			} })
	})

	it('verification is idempotent', async () => {
		const db = {
			'test-id-1': {
				email: {
					address: 'a@b.com',
					verificationCode: 'test-verification-code',
					isVerified: false,
				},
			},
		}
	
		for (let redundantCall = 0; redundantCall < 4; ++redundantCall) {
			const { status, body } = await requestVerifyEmail(db, 'test-verification-code')
			expect(status).toBe(StatusCodes.OK)
			expect(body).toMatchObject({
				verified: true,
			})
			expect(db).toMatchObject({
				'test-id-1': {
					email: {
						address: 'a@b.com',
						verificationCode: 'test-verification-code',
						isVerified: true,
					},
				} })
		}
	})
})


