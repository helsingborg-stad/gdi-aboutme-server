import { cleanupTestRepos, createTestRepo } from './mongo-test-utils'

afterAll(cleanupTestRepos)

describe('mongoPersonRepository', () => {
	it('updatePerson() and getPerson() are a dynamic duo', async () => {
		const repo = createTestRepo()
		await repo.updatePerson('test-person-123', { email: 'a@b.com' })

		const p = await repo.getPerson('test-person-123')
		expect(p).toMatchObject({
			id: 'test-person-123',
			email: {
				address: 'a@b.com',
			},
		})
	})

	it('updatePerson() upserts with defaults', async () => {
		const repo = createTestRepo()
		await repo.updatePerson('test-person-123', { email: 'a@b.com' }, () => ({
			firstName: 'test',
			lastName: 'testerson',
		}))

		const p = await repo.getPerson('test-person-123')
		expect(p).toMatchObject({
			id: 'test-person-123',
			firstName: 'test',
			lastName: 'testerson',
			email: {
				address: 'a@b.com',
			},
		})
	})

	it('updatePerson() stores last update', async () => {
		const repo = createTestRepo()
		await repo.updatePerson('test-person-123', { email: 'a@b.com' })
		await repo.updatePerson('test-person-123', { email: 'updated-a@b.com' })

		const p = await repo.getPerson('test-person-123')
		expect(p).toMatchObject({
			id: 'test-person-123',
			email: {
				address: 'updated-a@b.com',
			},
		})
	})
})