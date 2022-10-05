import request from 'supertest'
import { createAuthorizationHeadersFor, createTestApp } from './test-utils'
import { StatusCodes } from 'http-status-codes'

describe('updateMe()', () => {
	it('extracts user id from bearer token', () => createTestApp({}).run(
		async server => {
			const { status, body: { data, errors } } = await request(server)
				.post('/api/v1/aboutme/graphql')
				.set(createAuthorizationHeadersFor('test-person-123'))
				.send({
					query: `
					mutation UpdateMe($me: PersonInput!) {
						updateMe(me: $me) {
							id
							email {
								address
								isVerified
								verifiedDate
							}
						}
					}
				`, 
					variables: {
						me: {
							email: 'tester@test.com',
						},
					} })
			expect(status).toBe(StatusCodes.OK)
			expect(errors).toBeFalsy()
			expect(data).toMatchObject({
				updateMe: {
					id: 'test-person-123',
					email: {
						address: 'tester@test.com',
						isVerified: false,
						verifiedDate: null,
					},
				},
			})
		}))
})