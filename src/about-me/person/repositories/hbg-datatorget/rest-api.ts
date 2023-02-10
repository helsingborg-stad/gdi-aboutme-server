import request from 'superagent'

export const CATEGORY_PRIVATE = 1
export const CONTACT_TYPE_EMAIL = 1
export const CONTACT_TYPE_PHONE = 2

export interface GetPersonResult {
	jsonapi: {version: string}
	data:    {
		type: string
		id: string
		attributes: {
			person: PersonInformation[]
		}
	}
}

export interface UpdateContactDetailsRequest {
	jsonapi: {version: '1.0'}
	data: {
		type: 'person',
		// id: string,
		attributes: {
			person: {
				person_id: string,
				contact_information: ContactDetailsUpdate[]
			}[]
		}
	}
}

export interface VerifyContactDetailsRequest {
	jsonapi: {
		version: '1.0'
	},
	data: {
		type: 'verification',
		// "id": "string",
		attributes: {
			verify: {verification_code: string}[]
		}
	}
}

export interface ContactDetailsUpdate {
	category_id: number
	contact_type_id: number
	contact_value: string
}

export interface PersonInformation {
	person_id: string
	social_security_number: string
	first_name: string
	last_name: string
	contact_information: ContactInformation[];
}

export interface ContactInformation {
	category_id: number
	category_name: string
	contact_type_id: number
	contact_type_name: string
	contact_value: string
	is_verified: boolean
	verified_date: string
	verification_code: string
}

export interface RestClient {
	getPerson: (personId: string) => Promise<PersonInformation>
	updateContactDetails: (personGuid: string, updates: ContactDetailsUpdate[]) => Promise<void>
	verifyContactDetails: (...verificationCodes: string[]) => Promise<void>
}

const tap = <T>(v: T): T => (console.log(JSON.stringify(v, null, 2)), v)

export const toUpdateContactDetailsRequest = (personGuid: string, updates: ContactDetailsUpdate[]): UpdateContactDetailsRequest => ({
	jsonapi: { version: '1.0' },
	data: {
		type: 'person',
		attributes: {
			person: [{
				person_id: personGuid,
				contact_information: updates,
			}],
		},
	},
})

export const toVerifyContactDetailsRequest = (...verificationCodes: string[]): VerifyContactDetailsRequest => ({
	jsonapi: {
		version: '1.0',
	},
	data: {
		type: 'verification',
		// "id": "string",
		attributes: {
			verify: verificationCodes.map(vc => ({ verification_code: vc })),
		},
	},
})

export const createRestClient = ({ uri, apiKey }: {uri: string, apiKey: string}): RestClient => ({
	getPerson: id => request
		.get(new URL(`/api/v1/gdi/person/${id}`, uri).toString())
		.set('X-ApiKey', apiKey)
		.then(({ body }) => body as GetPersonResult)
		.then(tap)
		.then(p => p?.data?.attributes?.person?.[0]),

	updateContactDetails: (personGuid, updates) => request
		.post(new URL(`/api/v1/gdi/person/${personGuid}/contact-details`, uri).toString())
		.set('X-ApiKey', apiKey)
		.send(tap(toUpdateContactDetailsRequest(personGuid, updates)))
		.then(() => void 0),
	
	verifyContactDetails: (...verificationCodes: string[]) => request
		.put(new URL('/api/v1/gdi/person/contact-details/verify', uri).toString())
		.set('X-ApiKey', apiKey)
		.send(tap(toVerifyContactDetailsRequest(...verificationCodes)))
		.then(() => void 0),
})
