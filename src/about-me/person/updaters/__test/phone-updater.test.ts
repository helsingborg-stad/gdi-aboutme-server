import { Person, Phone } from '../../types'
import { createPhoneUpdater } from '../phone-updater'

const makePerson = (patch: Partial<Person>): Person => ({ id: 'test-person', ...patch })

describe('phoneUpdater', () => {
	it('allows resetting phone number (setting to ""', async () => {
		const updater = createPhoneUpdater('SE')

		const updated = await updater.updatePerson(
			makePerson({ 
				phone: {
					number: '123456789',
					isVerified: true,
					verifiedDate: '2020-02-02',
				},
			}),
			{ phoneNumber: '' })

		expect(updated).toMatchObject({
			phone: null,
		})
	})

	it('marks phone as unverified after update', async () => {
		const updater = createPhoneUpdater('SE')

		const updated = await updater.updatePerson(
			makePerson({ 
				phone: {
					number: '123456789',
					isVerified: true,
					verifiedDate: '2020-02-02',
				},
			}),
			{ phoneNumber: '072 12345678' })

		expect(updated).toMatchObject({
			phone: {
				number: '+467212345678',
				isVerified: false,
				verifiedDate: null,
			},
		})
	})

	it.each([
		['bad number'],
		['123'],
	])('throws on update with invalid number "%s"', async phoneNumber => {
		const updater = createPhoneUpdater('SE')

		const initialPhone: Phone = {
			number: '+467212345678',
			isVerified: true,
			verifiedDate: '2020-02-02',
		}
		
		await expect(() => updater.updatePerson(
			makePerson({ 
				phone: initialPhone,
			}),
			{ phoneNumber }))
			.rejects
			.toThrow('Validation error')
	})
	
	it('throws on malformed phone numbers', async () => {
		const updater = createPhoneUpdater('SE')

		const initialPhone: Phone = {
			number: '+467212345678',
			isVerified: true,
			verifiedDate: '2020-02-02',
		}
		
		await expect(() => updater.updatePerson(
			makePerson({ 
				phone: initialPhone,
			}),
			{ phoneNumber: 'badly formattted phone number' }))
			.rejects
			.toThrow('Validation error')
	})
})
