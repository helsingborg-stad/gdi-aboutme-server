import { Person, PersonNotifier, PersonUpdater, Phone } from '../../types'
import { createNotifyPhoneChangedUpdater } from '../notify-phone-changed-updater'

const notImplemented = () => { throw new Error('not implemented') }

describe('notifyEmailChangedUpdater', () => {

	const captureLogFromUpdates = async (initialPerson: Person, updatedPerson: Person): Promise<Phone[]> => {
		const nofificationLog: Phone[] = []
		const fakeUpdater: PersonUpdater = {
			updatePerson: async (): Promise<Person> => updatedPerson, 
		}
		const fakeNotifier: PersonNotifier = {
			notifyEmailChanged: notImplemented,
			notifyPhoneChanged:async (phone: Phone) => nofificationLog.push(phone),
		}
		const updater = createNotifyPhoneChangedUpdater(fakeUpdater, fakeNotifier)
		await updater.updatePerson(initialPerson, {})
		return nofificationLog
	}



	it('notifies when phone number is added', async () => {
		const log = await captureLogFromUpdates(
			{
				id: 'test-person-123',
			},
			{
				id: 'test-person-123',
				phone: {
					number: '+46721234567',
					isVerified: false,
					verificationCode: 'vc-1234',
				},
			}
		)
		expect(log).toMatchObject([
			{
				number: '+46721234567',
				verificationCode: 'vc-1234',
			},
		])
	})

	it('notifies when phone number is changed', async () => {
		const log = await captureLogFromUpdates(
			{
				id: 'test-person-123',
				phone: {
					number: '000-111',
				},
			},
			{
				id: 'test-person-123',
				phone: {
					number: '+46721234567',
					isVerified: false,
					verificationCode: 'vc-1234',
				},
			}
		)
		expect(log).toMatchObject([
			{
				number: '+46721234567',
				verificationCode: 'vc-1234',
			},
		])
	})
	it('does nothing if phone number is not set', async () => {
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

	it('does nothing is phone number is unchanged', async () => {
		const log = await captureLogFromUpdates(
			{
				id: 'test-person-123',
				phone: {
					number: '+721234567',
				},
			},
			{
				id: 'test-person-123',
				phone: {
					number: '+721234567',
					isVerified: false,
					verificationCode: 'vc-1234',
				},
			}
		)
		expect(log).toHaveLength(0)
	})
	it('does nothing if new phone number is verified', async () => {
		const log = await captureLogFromUpdates(
			{
				id: 'test-person-123',
				phone: {
					number: '+721234567',
				},
			},
			{
				id: 'test-person-123',
				phone: {
					number: '+721234567',
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
				phone: {
					number: '000-111',
				},
			},
			{
				id: 'test-person-123',
				phone: {
					number: '+721234567',
					isVerified: false,
					verificationCode: '',
				},
			}
		)
		expect(log).toHaveLength(0)
	})

})