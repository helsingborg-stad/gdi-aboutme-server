import { getEnv } from '@helsingborg-stad/gdi-api-node'
import { parsePhoneNumber } from 'awesome-phonenumber'
import { randomUUID } from 'crypto'
import { PersonUpdater, Phone } from '../types'
import { throwValidationErrorForField } from './validation-error'

export const createPhoneUpdaterFromEnv = (regionCode = 'SE'): PersonUpdater => createPhoneUpdater(getEnv('PHONENUMBER_REGION', { fallback: regionCode }))

const normalizeStringInput = (s?: string): string|null => (typeof s === 'string')
	? s.trim()
	: null

export const createPhoneUpdater = (regionCode: string): PersonUpdater => ({
	updatePerson: async (person, update) => ({
		...person,
		phone: patchPhone(person?.phone || null, getValidatedPhoneNumber(normalizeStringInput(update?.phoneNumber), regionCode)),
	}),
})

const getValidatedPhoneNumber = (number: string, regionCode: string): string => {
	if (!number) {
		return number
	}
	const parsed = parsePhoneNumber(number.trim(), regionCode)
	return parsed?.isPossible() && parsed?.getNumber('e164')
}

const patchPhone = (phone?: Phone, update?: string): Phone | null => 
	update === null
		? phone
		: update === ''
			? null
			: !update
				? (throwValidationErrorForField('phoneNumber'), phone)
				: (update !== phone?.number)
					? ({
						number: update,
						isVerified: false,
						verifiedDate: null,
						verificationCode: randomUUID(),
					})
					: phone
