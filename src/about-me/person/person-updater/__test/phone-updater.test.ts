import { Person, Phone } from '../../types'
import { createPhoneUpdater } from '../phone-updater'

const makePerson = (patch: Partial<Person>): Person => ({ id: 'test-person', ...patch })

describe('phoneUpdater', () => {
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
			{ phone: '072 12345678' })

		expect(updated).toMatchObject({
			phone: {
				number: '+467212345678',
				isVerified: false,
				verifiedDate: null,
			},
		})
	})

	it.each([
		[null],
		[''],
		['bad number'],
		['123'],
	])('ignores update on invalid number "%s"', async phone => {
		const updater = createPhoneUpdater('SE')

		const initialPhone: Phone = {
			number: '+467212345678',
			isVerified: true,
			verifiedDate: '2020-02-02',
		}
		
		const updated = await updater.updatePerson(
			makePerson({ 
				phone: initialPhone,
			}),
			{ phone })

		expect(updated).toMatchObject({
			phone: initialPhone,
		})
	})
	
	it('ignores malformed phone numbers', async () => {
		const updater = createPhoneUpdater('SE')

		const initialPhone: Phone = {
			number: '+467212345678',
			isVerified: true,
			verifiedDate: '2020-02-02',
		}
		
		const updated = await updater.updatePerson(
			makePerson({ 
				phone: initialPhone,
			}),
			{ phone: 'badly formattted phone number' })

		expect(updated).toMatchObject({
			phone: initialPhone,
		})
	})
})
