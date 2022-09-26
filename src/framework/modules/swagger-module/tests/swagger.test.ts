import * as request from 'supertest'
import swaggerModule from '..'
import { createApplication } from '../../../application'

const createTestApp = () => createApplication({
    openApiDefinitionPath: './openapi.yml',
    validateResponse: true
}).use(swaggerModule())

describe('swagger-module', () => {
	it('GET /swagger.json responds with JSON', async () => createTestApp().run(
		async server => {
			const { headers, status } = await request(server)
				.get('/swagger.json')
				.set('Accept', 'application/json')
			expect(headers['content-type']).toMatch(/json/)
			expect(status).toEqual(200)        
		}))
	it('GET / redirects to /swagger', async () => createTestApp().run(
		async server => {
			const { status, headers } = await request(server)
				.get('/')
			expect(status).toBe(302)
			expect(headers['location']).toBe('/swagger')
		}))
	it('GET /swagger responds with HTML', async () => createTestApp().run(
		async server => {
			const { status, headers } = await request(server)
				.get('/swagger')
			expect(status).toBe(200)
			expect(headers['content-type']).toMatch(/html/)
		}))
})