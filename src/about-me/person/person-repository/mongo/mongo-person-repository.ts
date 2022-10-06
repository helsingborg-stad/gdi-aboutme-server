import { MongoClient, Collection, Db } from 'mongodb'
import { getEnv } from '@helsingborg-stad/gdi-api-node'
import { Person, PersonRepository, PersonUpdater } from '../../types'

export const tryCreateMongoPersonRepositoryFromEnv = (updater: PersonUpdater): PersonRepository => {
	const uri = getEnv('MONGODB_URI',{ trim: true, fallback: '' })
	return uri ? createMongoPersonRepository({ 
		uri,
		dbName: getEnv('MONGODB_DB',{ trim: true, fallback: 'aboutme' }),
		collectionName: getEnv('MONGODB_COLLECTION',{ trim: true, fallback: 'persons' }),
	}, updater) : null
}

export interface MongoRepositoryConfiguration {
	uri: string
	dbName?: string
	collectionName?: string
}

interface Connection {
	client: MongoClient
	db: Db,
	collection: Collection
}

const connect = async ({ uri, dbName = 'aboutme', collectionName = 'persons' }: MongoRepositoryConfiguration): Promise<Connection> => {
	const client = new MongoClient(uri)
	const db = await client.db(dbName)
	await db.collection(collectionName).createIndex({ id: 1 }, { unique: true })
	return {
		client,
		db,
		collection: db.collection('persons'),
	}
}
export const createMongoPersonRepository = (config: MongoRepositoryConfiguration, updater: PersonUpdater): PersonRepository => {
	const c = connect(config)
	const withCollection = <T>(handler: (collection: Collection) => Promise<T>): Promise<T> => c.then(({ collection }) => handler(collection))

	return {
		getPerson: async (id, knownFromElsewhere) => {
			const found = await withCollection(c => c.findOne({ id }))
			return found ? {
				id,
				...found,
			}
				: knownFromElsewhere?.()
		},
		updatePerson: (id, update, knownFromElsewhere) => withCollection(async c => {
			const found = await c.findOne({ id })
			const updated = await updater.updatePerson({
				id,
				...(found || knownFromElsewhere?.()),
			}, update)
			await (found ? c.replaceOne({ id }, updated) : c.insertOne(updated))
			return (await c.findOne({ id })) as unknown as Person
		}),
	}
}
