import { StatusCodes } from 'http-status-codes'
import * as request from 'supertest'
import { createAuthorizationHeadersFor, createTestApp } from './test-utils'

describe('/aboutme/graphql', () => {
	it('gives 401 if no bearer token is supplied', () => createTestApp().run(
		async server => {
			const { status } = await request(server)
				.post('/api/v1/aboutme/graphql')
				.send({
					query: `
						query MyQuery {
							me {
								id
							}
						}`,
					parameters: {},
				})
				
			expect(status).toBe(StatusCodes.UNAUTHORIZED)
		}))
	it('gives 401 if invalid bearer token is supplied', () => createTestApp().run(
		async server => {
			const { status } = await request(server)
				.post('/api/v1/aboutme/graphql')
				.set(createAuthorizationHeadersFor('test-person-id-123', 'WRONG SIGNING KEY'))
				.send({
					query: `
						query MyQuery {
							me {
								id
							}
						}`,
					parameters: {},
				})
				
			expect(status).toBe(StatusCodes.UNAUTHORIZED)
		}))
	
	it('extracts user id from bearer token', () => createTestApp().run(
		async server => {
			const { status, body: { data } } = await request(server)
				.post('/api/v1/aboutme/graphql')
				.set(createAuthorizationHeadersFor('test-person-id-123'))
				.send({
					query: `
						query MyQuery {
							me {
								id
							}
						}`,
					parameters: {},
				})
				
			expect(status).toBe(StatusCodes.OK)
			expect(data).toMatchObject({
				me: {
					id: 'test-person-id-123',
				},
			})
		}
	))
})