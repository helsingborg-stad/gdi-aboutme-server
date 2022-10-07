import { PersonNotifier, PersonUpdater } from '../types'

export const createNotifyEmailChangedUpdater = (inner: PersonUpdater, notifier: PersonNotifier): PersonUpdater => ({
	updatePerson: async (initialPerson, update) => {
		const updatedPerson = await inner.updatePerson(initialPerson, update)

		const shouldNotify = updatedPerson?.email?.address
			&& !updatedPerson?.email?.isVerified
			&& updatedPerson?.email?.address !== initialPerson?.email?.address
			&& updatedPerson?.email?.verificationCode
		
		shouldNotify && notifier.notifyEmailChanged(updatedPerson.email)

		return updatedPerson
	},
})
