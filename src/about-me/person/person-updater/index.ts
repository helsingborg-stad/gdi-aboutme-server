import { PersonUpdater } from '../types'
import { createEmailUpdater } from './email-updater'
import { createPhoneUpdater, createPhoneUpdaterFromEnv } from './phone-updater'

export { createEmailUpdater }

export const createDefaultPersonUpdater = (): PersonUpdater => createCompositePersonUpdater(createEmailUpdater(), createPhoneUpdater('SE'))
export const createPersonUpdaterFromEnv = (): PersonUpdater => createCompositePersonUpdater(createEmailUpdater(), createPhoneUpdaterFromEnv())

export const createCompositePersonUpdater = (...updaters: PersonUpdater[]): PersonUpdater => ({
	updatePerson: async (person, update) => updaters.reduce((previous, updater) => previous.then(person => updater.updatePerson(person, update)), Promise.resolve(person)),
})
