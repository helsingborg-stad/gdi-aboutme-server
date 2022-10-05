import { PersonUpdater } from '../types'
import { createEmailUpdater } from './email-updater'

export { createEmailUpdater }

export const createDefaultPersonUpdater = (): PersonUpdater => createCompositePersonUpdater(createEmailUpdater())

export const createCompositePersonUpdater = (...updaters: PersonUpdater[]): PersonUpdater => ({
	updatePerson: async (person, update) => updaters.reduce((previous, updater) => previous.then(person => updater.updatePerson(person, update)), Promise.resolve(person)),
})
