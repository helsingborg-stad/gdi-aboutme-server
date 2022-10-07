import { getEnv } from '@helsingborg-stad/gdi-api-node'
import { parsePhoneNumber } from 'awesome-phonenumber'
import { randomUUID } from 'crypto'
import { PersonUpdater, Phone } from '../types'

export const createPhoneUpdaterFromEnv = (regionCode = 'SE'): PersonUpdater => createPhoneUpdater(getEnv('PHONENUMBER_REGION', { fallback: regionCode }))

export const createPhoneUpdater = (regionCode: string): PersonUpdater => ({
	updatePerson: async (person, update) => ({
		...person,
		phone: patchPhone(person?.phone, getValidatedPhoneNumber(update?.phoneNumber?.trim(), regionCode)),
	}),
})

const getValidatedPhoneNumber = (number: string, regionCode: string): string => {
	const parsed = parsePhoneNumber(number || '', regionCode)
	return parsed?.isPossible() && parsed?.getNumber('e164')
}

const patchPhone = (phone?: Phone, update?: string): Phone | null => update && (update !== phone?.number)
	? ({
		number: update,
		isVerified: false,
		verifiedDate: null,
		verificationCode: randomUUID(),
	})
	: phone
