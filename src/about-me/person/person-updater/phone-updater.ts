// import * as libphonenumberJs from 'libphonenumber-js'
import { getEnv } from '@helsingborg-stad/gdi-api-node'
import { parsePhoneNumber } from 'awesome-phonenumber'
import { PersonUpdater, Phone } from '../types'

export const createPhoneUpdaterFromEnv = (): PersonUpdater => createPhoneUpdater(getEnv('PHONENUMBER_REGION', { fallback: 'SE' }))

export const createPhoneUpdater = (regionCode: string): PersonUpdater => ({
	updatePerson: async (person, update) => ({
		...person,
		phone: patchPhone(person?.phone, getValidatedPhoneNumber(update?.phoneNumber?.trim(), regionCode)),
	}),
})


// const getValidatedPhoneNumber = (number: string, regionCode: string): string => (typeof number === 'string') ? parsePhoneNumber(number, regionCode).getNumber('e164'): null

const getValidatedPhoneNumber = (number: string, regionCode: string): string => {
	const parsed = parsePhoneNumber(number || '', regionCode)

	console.log({ number, parsed, regionCode })
	return parsed?.isPossible() && parsed?.getNumber('e164')
}

const patchPhone = (phone?: Phone, update?: string): Phone | null => update && (update !== phone?.number)
	? ({
		number: update,
		isVerified: false,
		verifiedDate: null,
	})
	: phone
