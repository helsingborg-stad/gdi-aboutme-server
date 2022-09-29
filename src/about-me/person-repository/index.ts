import { Email, Person, PersonInput, PersonRepository } from './types'

const patchEmail = (email?: Email, update?: string): Email | null => update && (update !== email?.address)
	? ({
		address: update,
		isVerified: false,
		verifiedDate: null,
	})
	: email

const patchPerson = (person?: Person, patch?: PersonInput): Person => ({
	...person,
	email: patchEmail(person?.email, patch?.email),
}) 

export const createPersonRepositoryFromEnv = (): PersonRepository => createPersonRepositoryInMemory({})

export const createPersonRepositoryInMemory = (db: object): PersonRepository => ({
	getPerson: id => db[id],
	updatePerson: (id, update) => db[id] = patchPerson({
		id,
		...db[id],
	}, update),
})