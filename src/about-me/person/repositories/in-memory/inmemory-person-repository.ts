import { createDefaultPersonUpdater } from '../../updaters/index'
import { createDefaultPersonNotifier } from '../../notifications/index'
import { PersonNotifier, PersonRepository, PersonUpdater } from '../../types'

/**
 * create person repository thats works totally in memory
 */
export const createInMemoryPersonRepository = (db: object, updater: PersonUpdater = createDefaultPersonUpdater(), notifier: PersonNotifier = createDefaultPersonNotifier()): PersonRepository => ({
	getPerson: async (id, knownFromElsewhere) => db[id] || knownFromElsewhere?.(),
	updatePerson: (id, update, knownFromElsewhere) => updater.updatePerson({ id, ...(db[id] || knownFromElsewhere?.()) }, update)
		.then(person => {
			db[id] = person
			return person
		}),
	verifyEmail: async verificationCode => {
		const found = Object.values(db).find(p => p.email?.verificationCode === verificationCode)
		if (found) {
			found.email.isVerified = true
			found.email.verifiedDate = new Date()
		}
		return found
	},
	verifyPhone: async verificationCode => {
		const found = Object.values(db).find(p => p.phone?.verificationCode === verificationCode)
		if (found) {
			found.phone.isVerified = true
			found.phone.verifiedDate = new Date()
		}
		return found
	},
	notifyEmail: async id => {
		const found = db[id]
		if (found?.email) {
			return notifier?.notifyEmailChanged(found.email)
		}
		return false
	},
	notifyPhone: async id => {
		const found = db[id]
		if (found?.phone) {
			return notifier?.notifyPhoneChanged(found.email)
		}
		return false
	},
	checkHealth: async () => true,
})