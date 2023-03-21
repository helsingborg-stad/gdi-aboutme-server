import { createPersonNotifierFromEnv } from '../notifications/index'
import { PersonNotifier, PersonRepository, PersonUpdater } from '../types'
import { createPersonUpdaterFromEnv } from '../updaters/index'
import { tryCreateDatatorgetFrendsPersonRepositoryFromEnv } from './hbg-datatorget/index'
import { createInMemoryPersonRepository } from './in-memory/inmemory-person-repository'
import { tryCreateMongoPersonRepositoryFromEnv } from './mongo'

export { createInMemoryPersonRepository } 

/**
 * create person repository based on configuration from environment
 */
/* istanbul ignore next : runtime configuration read */
export const createPersonRepositoryFromEnv = (
	updater: PersonUpdater = createPersonUpdaterFromEnv(),
	notifier: PersonNotifier = createPersonNotifierFromEnv()): PersonRepository => 
	tryCreateDatatorgetFrendsPersonRepositoryFromEnv(updater, notifier)	
	|| tryCreateMongoPersonRepositoryFromEnv(updater, notifier) 
	|| createInMemoryPersonRepository({}, updater, notifier)
