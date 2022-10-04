import request from 'supertest'
import { createApplication } from '@helsingborg-stad/gdi-api-node'
import { fallbackUserModule } from '..'
import { StatusCodes } from 'http-status-codes'

const createTestApp = () => createApplication({
	openApiDefinitionPath: './openapi.yml',
	validateResponse: true,
})

describe('fallback-user-module', () => {
	const originalEnv = process.env
	beforeEach(() => {
		process.env = { ...originalEnv } // Make a copy
	})

	afterAll(() => {
		process.env = originalEnv
	})

	const patchEnvAndThen = <T>(patch: object, then: (() => Promise<T>)) => {
		process.env = { ...process.env, ...patch }
		return then()
	}

	it('updates ctx.user', async () => patchEnvAndThen(
		{
			NODE_ENV: 'development',
		},
		() => createTestApp()
			.use(fallbackUserModule({ id: 123, name: 'test person' }))
			.use(({ router }) => router.get('/gimme-the-fake-user', ctx => {
				ctx.body = ctx.user
			}))
			.run(
				async server => {
					const { status, body: user } = await request(server)
						.get('/gimme-the-fake-user')
					expect(status).toBe(StatusCodes.OK)
					expect(user).toMatchObject({ id: 123, name: 'test person' })
				})))

	it('does nothing if NODE_ENV !== development', async () => patchEnvAndThen(
		{
			NODE_ENV: 'production',
		}, 
		() => createTestApp()
			.use(fallbackUserModule({ id: 123, name: 'test person which should be discarded due to wrong environment' }))
			.use(({ router }) => router.get('/gimme-the-fake-user', ctx => {
				ctx.body = ctx.user || { message: 'user not found' }
			}))
			.run(
				async server => {
					const { status, body: user } = await request(server)
						.get('/gimme-the-fake-user')
					expect(status).toBe(StatusCodes.OK)
					expect(user).toMatchObject({ message: 'user not found' })
				})))
    
})