import { createDefaultPersonUpdater } from '../../updaters/index'
import { PersonRepository, PersonUpdater } from '../../types'

/**
 * create person repository thats works totally in memory
 */
export const createInMemoryPersonRepository = (db: object, updater: PersonUpdater = createDefaultPersonUpdater()): PersonRepository => ({
	getPerson: async (id, knownFromElsewhere) => db[id] || knownFromElsewhere?.(),
	updatePerson: (id, update, knownFromElsewhere) => updater.updatePerson({ id, ...(db[id] || knownFromElsewhere?.()) }, update)
		.then(person => {
			db[id] = person
			return person
		}),
})