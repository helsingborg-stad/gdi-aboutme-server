import { PersonNotifier, PersonUpdater } from '../types'

export const createNotifyPhoneChangedUpdater = (inner: PersonUpdater, notifier: PersonNotifier): PersonUpdater => ({
	notifier,
	updatePerson: async (initialPerson, update) => {
		const updatedPerson = await inner.updatePerson(initialPerson, update)

		const shouldNotify = updatedPerson?.phone?.number
			&& !updatedPerson?.phone?.isVerified
			&& updatedPerson?.phone?.number !== initialPerson?.phone?.number
			&& updatedPerson?.phone?.verificationCode
		
		shouldNotify && notifier.notifyPhoneChanged(updatedPerson.phone)

		return updatedPerson
	},
})
