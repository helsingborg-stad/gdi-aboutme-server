import * as EmailValidator from 'email-validator'
import { Email, PersonUpdater } from '../types'

export const createEmailUpdater = (): PersonUpdater => ({
	updatePerson: async (person, update) => ({
		...person,
		email: patchEmail(person?.email, update?.email?.trim()),
	}),
})

const patchEmail = (email?: Email, update?: string): Email | null => update && EmailValidator.validate(update) && (update !== email?.address)
	? ({
		address: update,
		isVerified: false,
		verifiedDate: null,
	})
	: email
