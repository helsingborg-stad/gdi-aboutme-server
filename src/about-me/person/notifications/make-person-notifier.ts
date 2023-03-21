import { Person, PersonNotifier } from '../types'

export const makePersonNotifier = (inner: Omit<PersonNotifier, 'notifyPersonUpdates'>): PersonNotifier => ({
	notifyPersonUpdates: async (initial?: Person, updated?: Person) => {
		const email = updated?.email && !updated?.email.isVerified && updated?.email?.verificationCode && (updated?.email?.address != initial?.email?.address) && updated?.email
		const phone = updated?.phone && !updated.phone.isVerified && updated?.phone?.verificationCode && (updated.phone?.number != initial?.phone?.number) && updated.phone
		email && await inner.notifyEmailChanged(email)
		phone && await inner.notifyPhoneChanged(phone)
	},
	notifyEmailChanged: email => inner.notifyEmailChanged(email),
	notifyPhoneChanged: phone => inner.notifyPhoneChanged(phone),
})