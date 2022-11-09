import { Email, Person } from '../../types'
import { createEmailUpdater } from '../email-updater'

const makePerson = (patch: Partial<Person>): Person => ({ id: 'test-person', ...patch })

describe('emailUpdater', () => {
	it('allows resetting email (setting to ""', async () => {
		const updater = createEmailUpdater()

		const updated = await updater.updatePerson(
			makePerson({ 
				email: {
					address: 'veri@fi.ed',
					isVerified: true,
					verifiedDate: '2020-02-02',
				},
			}),
			{ email: '' })

		expect(updated).toMatchObject({
			email: null,
		})
	})

	it('marks email as unverified after update', async () => {
		const updater = createEmailUpdater()

		const updated = await updater.updatePerson(
			makePerson({ 
				email: {
					address: 'veri@fi.ed',
					isVerified: true,
					verifiedDate: '2020-02-02',
				},
			}),
			{ email: 'test@pers.on' })

		expect(updated).toMatchObject({
			email: {
				address: 'test@pers.on',
				isVerified: false,
				verifiedDate: null,
			},
		})
	})
	it('ignores malformed emails', async () => {
		const updater = createEmailUpdater()

		const initialEmail: Email = {
			address: 'veri@fi.ed',
			isVerified: true,
			verifiedDate: '2020-02-02',
		}
		
		const updated = await updater.updatePerson(
			makePerson({ 
				email: initialEmail,
			}),
			{ email: 'badly formattted email' })

		expect(updated).toMatchObject({
			email: initialEmail,
		})
	})
})