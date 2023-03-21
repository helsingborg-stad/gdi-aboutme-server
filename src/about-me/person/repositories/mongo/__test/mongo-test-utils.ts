import { MongoClient } from 'mongo-mock'
import { createMongoPersonRepository, MongoPersonRepository } from '../mongo-person-repository'
import { createDefaultPersonUpdater } from '../../../updaters'
import { randomUUID } from 'crypto'
import { Email, Phone } from '../../../types'
import { makePersonNotifier } from '../../../notifications/make-person-notifier'

// We create a mocked mongodb
const createMongoClient = (uri) => MongoClient.connect(uri)

// keep track of repos so we can close them
const testRepositories: MongoPersonRepository[] = []

const registerTestRepo = (repo: MongoPersonRepository): MongoPersonRepository => (testRepositories.push(repo), repo)

export const cleanupTestRepos = async (): Promise<void> => {
	while (testRepositories.length) {
		const repo = testRepositories.pop()
		await repo?.inspect(({ client }) => client.close())
		await repo?.inspect(({ db }) => (db as any)?.close?.())
	}
}

export const createTestRepo = (notificationsLog: any[] = []): MongoPersonRepository => registerTestRepo(
	createMongoPersonRepository(
		{
			uri: `mongodb://fake-test-host-${randomUUID()}:27017/test-about-me${randomUUID()}`,
			collectionName: 'persons',
			testMode: true,
		},
		createDefaultPersonUpdater(),
		makePersonNotifier({
			notifyEmailChanged: async (email?: Email) => (notificationsLog.push(email), true),
			notifyPhoneChanged: async (phone?: Phone) => (notificationsLog.push(phone), true),
		}),
		(url) => createMongoClient(url)))
