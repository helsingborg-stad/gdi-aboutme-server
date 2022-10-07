import { ceateDefaultPersonNotifier, createPersonNotifierFromEnv } from '../notifications/index'
import { createNotifyEmailChangedUpdater } from '../notifications/notify-email-changed-updater'
import { PersonUpdater } from '../types'
import { createEmailUpdater } from './email-updater'
import { createPhoneUpdater, createPhoneUpdaterFromEnv } from './phone-updater'

/**
 * Create person updater that handles phone, email as well as change notifications agains configured services
 */
export const createDefaultPersonUpdater = (regionCode = 'SE'): PersonUpdater => createNotifyEmailChangedUpdater(
	createCompositePersonUpdater(
		createEmailUpdater(),
		createPhoneUpdater(regionCode)),
	ceateDefaultPersonNotifier())

/**
 * Create person updater that handles phone, email as well as change notifications agains configured services
 */
export const createPersonUpdaterFromEnv = (): PersonUpdater => 
	createNotifyEmailChangedUpdater(
		createCompositePersonUpdater(
			createEmailUpdater(),
			createPhoneUpdaterFromEnv()),
		createPersonNotifierFromEnv())

/**
 * Create composite that aggregates updates by calling individuak updaters sequentially
 */
export const createCompositePersonUpdater = (...updaters: PersonUpdater[]): PersonUpdater => ({
	updatePerson: async (person, update) => updaters.reduce((previous, updater) => previous.then(person => updater.updatePerson(person, update)), Promise.resolve(person)),
})
