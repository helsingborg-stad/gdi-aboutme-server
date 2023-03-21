import { Person, PersonNotifier, PersonRepository, PersonUpdater } from '../../types'
import { ContactDetailsUpdate, PersonInformation, RestClient } from './rest-api'

export const toPerson = (p: PersonInformation): Person => p ? ({
	id: p.social_security_number,
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

export const createHbgDatatorgetPersonRepository = (client: RestClient, updater: PersonUpdater, notifier: PersonNotifier) : PersonRepository => ({
	getPerson: async (id, knownFromElsewhere) => {
		const found = await client.getPerson(id)
		return toPerson(found) // || knownFromElsewhere?.()
	},
	updatePerson: async (id, update, knownFromElsewhere) => {
		const found = await client.getPerson(id)
		const updated = await updater.updatePerson({
			id,
			...(toPerson(found) || knownFromElsewhere?.()),
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

		const final = await client.getPerson(id).then(toPerson)
		await notifier.notifyPersonUpdates(toPerson(found), final)
		return final
	},
	verifyEmail: async (verificationCode) => client
		.verifyContactDetails(verificationCode)
		.then(() => ({} as Person), () => null),
	verifyPhone: async (verificationCode) => client
		.verifyContactDetails(verificationCode)
		.then(() => ({} as Person), () => null),
	notifyEmail: async (id) => {
		const found = toPerson(await client.getPerson(id))
		return found && await notifier.notifyEmailChanged(found?.email)
	},
	notifyPhone: async (id) => {
		const found = toPerson(await client.getPerson(id))
		return found && await notifier.notifyPhoneChanged(found?.phone)
	},
	checkHealth: async () => true,
})
