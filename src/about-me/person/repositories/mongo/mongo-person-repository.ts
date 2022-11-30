import { MongoClient, Collection, Db, MongoClientOptions } from 'mongodb'
import { Person, PersonRepository, PersonUpdater } from '../../types'

export interface MongoPersonRepository extends PersonRepository {
	inspect: (inspector: (connection: Connection) => any) => Promise<any>
}
export interface MongoRepositoryConfiguration {
	uri: string
	collectionName?: string
	// TODO:testMode is a technical debth introduced to solve that our current mongodb mock doesnt support sparse indices
	//a dn that we want to skip creation of such in tests
	testMode?: boolean
	
}

type MongoClientFactory = (url: string, options?: MongoClientOptions) => Promise<MongoClient>

interface Connection {
	client: MongoClient
	db: Db
	collection: Collection
}

const defaultMongoClientFactory: MongoClientFactory = (url, options) => MongoClient.connect(url, options)

const connect = async ({ uri, collectionName = 'persons', testMode = false }: MongoRepositoryConfiguration, clientFactory: MongoClientFactory = defaultMongoClientFactory): Promise<Connection> => {
	const client = await clientFactory(uri)
	const db = await client.db()
	await db.collection(collectionName).createIndex({ id: 1 }, { unique: true, name: 'unique_index__id' })

	testMode || await db.collection(collectionName).createIndex({ 'email.verificationCode': 1 }, { unique: true, sparse: true, name: 'index__email_verification_code' })
	testMode || await db.collection(collectionName).createIndex({ 'phone.verificationCode': 1 }, { unique: true, sparse: true, name: 'index__phone_verification_code' })
	return {
		client,
		db,
		collection: db.collection('persons'),
	}
}
export const createMongoPersonRepository = (config: MongoRepositoryConfiguration, updater: PersonUpdater, clientFactory: MongoClientFactory = defaultMongoClientFactory) : MongoPersonRepository => {
	const c = connect(config, clientFactory)
	const withConnection = <T>(handler: (connection: Connection) => Promise<T>): Promise<T> => c.then(connection => handler(connection))
	return {
		getPerson: async (id, knownFromElsewhere) => {
			const found = await withConnection(({ collection }) => collection.findOne({ id }))
			return found ? {
				id,
				...found,
			}
				: knownFromElsewhere?.()
		},
		updatePerson: (id, update, knownFromElsewhere) => withConnection(async ({ collection }) => {
			const found = await collection.findOne({ id })
			const updated = await updater.updatePerson({
				id,
				...(found || knownFromElsewhere?.()),
			}, update)
			// await (found ? collection.replaceOne({ id }, updated) : collection.insertOne(updated))
			await (found ? collection.updateOne({ id }, { $set: updated }) : collection.insertOne(updated))
			return (await collection.findOne({ id })) as unknown as Person
		}),
		verifyEmail: (verificationCode) => withConnection(async ({ collection }) => {
			await collection.updateOne(
				{ 'email.verificationCode':verificationCode, 'email.isVerified': false },
				{ $set: {
					'email.isVerified': true,
					'email.verifiedDate': new Date(),
				} }
			)
			const updated = await collection.findOne({ 'email.verificationCode':verificationCode, 'email.isVerified': true })
			return updated as unknown as Person
		}),
		verifyPhone: (verificationCode) => withConnection(async ({ collection }) => {
			await collection.updateOne(
				{ 'phone.verificationCode':verificationCode, 'phone.isVerified': false },
				{ $set: {
					'phone.isVerified': true,
					'phone.verifiedDate': new Date(),
				} }
			)
			const updated = await collection.findOne({ 'phone.verificationCode':verificationCode, 'phone.isVerified': true })
			return updated as unknown as Person

		}),
		notifyEmail: (id) => withConnection(async ({ collection }) => {
			const found = await collection.findOne({ id }) as unknown as Person
			return found && await updater?.notifier?.notifyEmailChanged(found?.email)
		}),
		notifyPhone: (id) => withConnection(async ({ collection }) => {
			const found = await collection.findOne({ id }) as unknown as Person
			return found && await updater?.notifier?.notifyPhoneChanged(found?.phone)
		}),
		checkHealth: async () => withConnection(async ({ collection }) => collection.findOne({ id: 'id-for-healthcheck-purposes' })).then(() => true),
		inspect: handler => withConnection(handler),
	}
}
