import { PersonRepository, PersonUpdater } from '../types'
import { createPersonUpdaterFromEnv } from '../updaters/index'
import { createInMemoryPersonRepository } from './in-memory/inmemory-person-repository'
import { tryCreateMongoPersonRepositoryFromEnv } from './mongo'

export { createInMemoryPersonRepository } 

/**
 * create person repository based on configuration from environment
 */
/* istanbul ignore next : runtime configuration read */
export const createPersonRepositoryFromEnv = (updater: PersonUpdater = createPersonUpdaterFromEnv()): PersonRepository => 
	tryCreateMongoPersonRepositoryFromEnv(updater) || createInMemoryPersonRepository({}, updater)
