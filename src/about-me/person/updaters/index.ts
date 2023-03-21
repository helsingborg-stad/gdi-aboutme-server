import { PersonUpdater } from '../types'
import { createEmailUpdater, createEmailUpdaterFromEnv } from './email-updater'
import { createPhoneUpdater, createPhoneUpdaterFromEnv } from './phone-updater'

/**
 * Create person updater that handles phone and email
 */
export const createDefaultPersonUpdater = (regionCode = 'SE'): PersonUpdater => createCompositePersonUpdater(
	createEmailUpdater(), createPhoneUpdater(regionCode))


/**
 * Create person updater that handles phone, email as well as change notifications agains configured services
 */
export const createPersonUpdaterFromEnv = (): PersonUpdater => createCompositePersonUpdater(
	createEmailUpdaterFromEnv(),
	createPhoneUpdaterFromEnv())

/**
 * Create composite that aggregates updates by calling individual updaters sequentially
 */
export const createCompositePersonUpdater = (...updaters: PersonUpdater[]): PersonUpdater => ({
	updatePerson: async (person, update) => updaters.reduce((previous, updater) => previous.then(person => updater.updatePerson(person, update)), Promise.resolve(person)),
})
