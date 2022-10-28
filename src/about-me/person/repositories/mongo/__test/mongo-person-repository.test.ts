// import { MongoClient, Collection, Db } from 'mongodb'

import { MongoClient } from 'mongo-mock'
import { createMongoPersonRepository, MongoPersonRepository } from '../mongo-person-repository'
import { createDefaultPersonUpdater } from '../../../updaters'
import { randomUUID } from 'crypto'

// We create a mocked mongodb
const createMongoClient = (uri) => MongoClient.connect(uri)

// keep track of repos so we can close them
const testRepositories: MongoPersonRepository[] = []

afterAll(async () => {
	while (testRepositories.length) {
		const repo = testRepositories.pop()
		await repo?.inspect(({ client }) => client.close())
		await repo?.inspect(({ db }) => (db as any)?.close?.())
	}
})

const registerTestRepo = (repo: MongoPersonRepository): MongoPersonRepository => (testRepositories.push(repo), repo)

const createTestRepo = () => registerTestRepo(createMongoPersonRepository({
	uri: `mongodb://fake-test-host-${randomUUID()}:27017/test-about-me${randomUUID()}`,
	collectionName: 'persons',
	testMode: true,
}, createDefaultPersonUpdater(),
(url) => createMongoClient(url)))


describe('mongoPersonRepository', () => {
	it('can update and fetch', async () => {
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

	it('can be patched we known info', async () => {
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

	it('can be updated', async () => {
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