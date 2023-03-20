import { Person, PersonRepository, PersonUpdater } from '../../types'
import { ContactDetailsUpdate, PersonInformation, RestClient } from './rest-api'

export const toPerson = (p: PersonInformation): Person => p ? ({
	id: p.social_security_number,
	readOnly: false,
	firstName: p.first_name,
	lastName: p.last_name,
	email: p.contact_information?.filter(c => (c.category_id === 1) && (c.contact_type_id === 1))
		.map(c => ({
			address: c.contact_value,
			isVerified: c.is_verified,
			verifiedDate: c.verified_date,
			verificationCode: c.verification_code, 
		}))[0] || null,
	phone: p.contact_information?.filter(c => (c.category_id === 1) && (c.contact_type_id === 2))
		.map(c => ({
			number: c.contact_value,
			isVerified: c.is_verified,
			verifiedDate: c.verified_date,
			verificationCode: c.verification_code, 
		}))[0] || null,
}) : null

const combineToPerson = (id: string, p: PersonInformation, knownFromElseWhere: () => Partial<Person>): Person => 
	toPerson(p) || ({ id, readOnly: true, ...knownFromElseWhere?.() })

export const createHbgDatatorgetPersonRepository = (client: RestClient, updater: PersonUpdater) : PersonRepository => ({
	/*
	getPerson: async (id, knownFromElsewhere) => {
		const found = await client.getPerson(id)
		return toPerson(found) || { id, readOnly: true, ...knownFromElsewhere?.() }
	},
	*/
	getPerson: async (id, knownFromElsewhere) => combineToPerson(
		id,
		await client.getPerson(id),
		knownFromElsewhere),
	updatePerson: async (id, update, knownFromElsewhere) => {
		const found = await client.getPerson(id)
		if (found) {
			const updated = await updater.updatePerson({
				id,
				...(toPerson(found) || { ...knownFromElsewhere?.(), readOnly: true }),
			}, update)
			const updates: ContactDetailsUpdate[] = [
				{
					category_id: 1,
					contact_type_id: 1,
					contact_value: updated.email?.address || '',
				},
				{
					category_id: 1,
					contact_type_id: 2,
					contact_value: updated.phone?.number || '',
				},
			].filter(v => v)
			await client.updateContactDetails(found.person_id, updates)
		}
		// return client.getPerson(id).then(toPerson)
		return combineToPerson(
			id,
			await client.getPerson(id),
			knownFromElsewhere 
		)
	},
	verifyEmail: async (verificationCode) => {
		await client.verifyContactDetails(verificationCode)
		return {} as Person
	},
	verifyPhone: async (verificationCode) => {
		await client.verifyContactDetails(verificationCode)
		return {} as Person
	},
	notifyEmail: async (id) => {
		const found = toPerson(await client.getPerson(id))
		return found && await updater?.notifier?.notifyEmailChanged(found?.email)
	},
	notifyPhone: async (id) => {
		const found = toPerson(await client.getPerson(id))
		return found && await updater?.notifier?.notifyPhoneChanged(found?.phone)
	},
	checkHealth: async () => true,
})
