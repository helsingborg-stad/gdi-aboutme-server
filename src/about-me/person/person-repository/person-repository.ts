import { createDefaultPersonUpdater } from '../person-updater/index'
import { PersonRepository, PersonUpdater } from '../types'

export const createPersonRepositoryFromEnv = (updater: PersonUpdater = createDefaultPersonUpdater()): PersonRepository => createPersonRepositoryInMemory({}, updater)

export const createPersonRepositoryInMemory = (db: object, updater: PersonUpdater = createDefaultPersonUpdater()): PersonRepository => ({
	getPerson: async (id, knownFromElsewhere) => db[id] || knownFromElsewhere?.(),
	updatePerson: (id, update, knownFromElsewhere) => updater.updatePerson({ id, ...(db[id] || knownFromElsewhere?.()) }, update)
		.then(person => {
			db[id] = person
			return person
		}),
})