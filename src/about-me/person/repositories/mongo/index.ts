import { getEnv } from '@helsingborg-stad/gdi-api-node'
import { PersonRepository, PersonUpdater } from '../../types'
import { createMongoPersonRepository } from './mongo-person-repository'

export { createMongoPersonRepository }

/* istanbul ignore next : runtime configuration read */
export const tryCreateMongoPersonRepositoryFromEnv = (updater: PersonUpdater): PersonRepository | null => {
	const uri = getEnv('MONGODB_URI',{ trim: true, fallback: '' })
	return uri ? createMongoPersonRepository({ 
		uri,
		collectionName: getEnv('MONGODB_COLLECTION',{ trim: true, fallback: 'persons' }),
	}, updater) : null
}
