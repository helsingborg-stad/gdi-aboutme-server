// import { MongoClient, Collection, Db } from 'mongodb'

import { MongoClient } from 'mongo-mock'
import { createMongoPersonRepository, MongoPersonRepository } from '../mongo-person-repository'
import { createDefaultPersonUpdater } from '../../../updaters'
import { randomUUID } from 'crypto'

const URI = 'mongodb://fake-test-host:27017/test-about-me'

const createMongoClient = (uri = URI) => MongoClient.connect(uri)

// const testRepo: MongoPersonRepository = null as unknown as MongoPersonRepository

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
})