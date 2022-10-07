import { PersonRepository, PersonUpdater } from '../types'
import { createPersonUpdaterFromEnv } from '../updaters/index'
import { createInMemoryPersonRepository } from './in-memory/inmemory-person-repository'
import { tryCreateMongoPersonRepositoryFromEnv } from './mongo/mongo-person-repository'

export { createInMemoryPersonRepository } 

/**
 * create person repository based on configuration from environment
 */
export const createPersonRepositoryFromEnv = (updater: PersonUpdater = createPersonUpdaterFromEnv()): PersonRepository => 
	tryCreateMongoPersonRepositoryFromEnv(updater) || createInMemoryPersonRepository({}, updater)
