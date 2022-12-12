import { randomUUID } from 'crypto'
import * as EmailValidator from 'email-validator'
import { Email, PersonUpdater } from '../types'
import { throwValidationErrorForField } from './validation-error'

const normalizeStringInput = (s?: string): string|null => (typeof s === 'string')
	? s.trim()
	: null

export const createEmailUpdater = (): PersonUpdater => ({
	updatePerson: async (person, update) => ({
		...person,
		email: patchEmail(person?.email || null, getValidatedEmail(normalizeStringInput(update?.email))),
	}),
})

const getValidatedEmail = (email: string): string|null|false => email && EmailValidator.validate(email) && email

const patchEmail = (email: Email, update: string|null|false): Email | null => 
	update === null
		? email
		: update === ''
			? null
			: !update
				? (throwValidationErrorForField('email'), email)
				: update !== email?.address
					? ({
						address: update,
						isVerified: false,
						verifiedDate: null,
						verificationCode: randomUUID(),
					})
					: email
