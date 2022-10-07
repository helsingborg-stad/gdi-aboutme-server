import { Email, Person, PersonNotifier, PersonUpdater } from '../../types'
import { createNotifyEmailChangedUpdater } from '../notify-email-changed-updater'

describe('notifyEmailChangedUpdater', () => {

	const captureLogFromUpdates = async (initialPerson: Person, updatedPerson: Person): Promise<Email[]> => {
		const nofificationLog: Email[] = []
		const fakeUpdater: PersonUpdater = {
			updatePerson: async (): Promise<Person> => updatedPerson, 
		}
		const fakeNotifier: PersonNotifier = {
			notifyEmailChanged: async (email: Email) => nofificationLog.push(email),
		}
		const updater = createNotifyEmailChangedUpdater(fakeUpdater, fakeNotifier)
		await updater.updatePerson(initialPerson, {})
		return nofificationLog
	}



	it('notifies when email is added', async () => {
		const log = await captureLogFromUpdates(
			{
				id: 'test-person-123',
			},
			{
				id: 'test-person-123',
				email: {
					address: 'a@b.com',
					isVerified: false,
					verificationCode: 'vc-1234',
				},
			}
		)
		expect(log).toMatchObject([
			{
				address: 'a@b.com',
				verificationCode: 'vc-1234',
			},
		])
	})

	it('notifies when email is changed', async () => {
		const log = await captureLogFromUpdates(
			{
				id: 'test-person-123',
				email: {
					address: 'to@be.replaced',
				},
			},
			{
				id: 'test-person-123',
				email: {
					address: 'a@b.com',
					isVerified: false,
					verificationCode: 'vc-1234',
				},
			}
		)
		expect(log).toMatchObject([
			{
				address: 'a@b.com',
				verificationCode: 'vc-1234',
			},
		])
	})
	it('does nothing if mail is not set', async () => {
		const log = await captureLogFromUpdates(
			{
				id: 'test-person-123',
			},
			{
				id: 'test-person-123',
			}
		)
		expect(log).toHaveLength(0)
	})

	it('does nothing is mail is unchanged', async () => {
		const log = await captureLogFromUpdates(
			{
				id: 'test-person-123',
				email: {
					address: 'a@b.com',
				},
			},
			{
				id: 'test-person-123',
				email: {
					address: 'a@b.com',
					isVerified: false,
					verificationCode: 'vc-1234',
				},
			}
		)
		expect(log).toHaveLength(0)
	})
	it('does nothing if new mail is verified', async () => {
		const log = await captureLogFromUpdates(
			{
				id: 'test-person-123',
				email: {
					address: 'a@b.com',
				},
			},
			{
				id: 'test-person-123',
				email: {
					address: 'updated@b.com',
					isVerified: true,
					verificationCode: 'vc-1234',
				},
			}
		)
		expect(log).toHaveLength(0)
	})
	it('does nothing if verificationCode is missing', async () => {
		const log = await captureLogFromUpdates(
			{
				id: 'test-person-123',
				email: {
					address: 'a@b.com',
				},
			},
			{
				id: 'test-person-123',
				email: {
					address: 'updated@b.com',
					isVerified: false,
					verificationCode: '',
				},
			}
		)
		expect(log).toHaveLength(0)
	})

})