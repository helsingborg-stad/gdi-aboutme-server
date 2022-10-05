import { createDefaultPersonUpdater } from '../person-updater/index'
import { PersonRepository, PersonUpdater } from '../types'
import { tryCreateMongoPersonRepositoryFromEnv } from './mongo/mongo-person-repository'

export const createPersonRepositoryFromEnv = (updater: PersonUpdater = createDefaultPersonUpdater()): PersonRepository => 
	tryCreateMongoPersonRepositoryFromEnv(updater) || createPersonRepositoryInMemory({}, updater)

export const createPersonRepositoryInMemory = (db: object, updater: PersonUpdater = createDefaultPersonUpdater()): PersonRepository => ({
	getPerson: async (id, knownFromElsewhere) => db[id] || knownFromElsewhere?.(),
	updatePerson: (id, update, knownFromElsewhere) => updater.updatePerson({ id, ...(db[id] || knownFromElsewhere?.()) }, update)
		.then(person => {
			db[id] = person
			return person
		}),
})