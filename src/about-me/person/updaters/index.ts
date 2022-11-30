import { ceateDefaultPersonNotifier as createDefaultPersonNotifier, createPersonNotifierFromEnv } from '../notifications/index'
import { createNotifyEmailChangedUpdater } from '../notifications/notify-email-changed-updater'
import { createNotifyPhoneChangedUpdater } from '../notifications/notify-phone-changed-updater'
import { PersonNotifier, PersonUpdater } from '../types'
import { createEmailUpdater } from './email-updater'
import { createPhoneUpdater, createPhoneUpdaterFromEnv } from './phone-updater'

/**
 * Create person updater that handles phone, email as well as change notifications agains configured services
 */
export const createDefaultPersonUpdater = (regionCode = 'SE'): PersonUpdater => createDefaultNotifyingUpdater(
	createDefaultPersonNotifier(), createEmailUpdater(), createPhoneUpdater(regionCode))


/**
 * Create person updater that handles phone, email as well as change notifications agains configured services
 */
export const createPersonUpdaterFromEnv = (): PersonUpdater => createDefaultNotifyingUpdater(
	createPersonNotifierFromEnv(),
	createEmailUpdater(),
	createPhoneUpdaterFromEnv())

/**
 * Create composite that aggregates updates by calling individual updaters sequentially
 */
export const createCompositePersonUpdater = (...updaters: PersonUpdater[]): PersonUpdater => ({
	updatePerson: async (person, update) => updaters.reduce((previous, updater) => previous.then(person => updater.updatePerson(person, update)), Promise.resolve(person)),
})

export const createDefaultNotifyingUpdater = (notifier: PersonNotifier, ...updaters: PersonUpdater[]): PersonUpdater => ({
	notifier,
	...createNotifyEmailChangedUpdater(
		createNotifyPhoneChangedUpdater(
			createCompositePersonUpdater(...updaters)
			, notifier),notifier),
})
	
