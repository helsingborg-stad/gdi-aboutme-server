import { Email, Person, PersonNotifier, Phone } from '../../types'
import { makePersonNotifier } from '../make-person-notifier'

const notImplemented = () => { throw new Error('not implemented') }

describe('makePersonNotifier().notifyPersonUpdates() -> notifyPhoneChanged()', () => {
	const captureNotifications = async (initialPerson: Person, updatedPerson: Person): Promise<Phone[]> => {
		const nofificationLog: Phone[] = []
		const fakeNotifier: PersonNotifier = makePersonNotifier({
			notifyEmailChanged: notImplemented,
			notifyPhoneChanged: async (phone?: Phone) => (phone && nofificationLog.push(phone), true),
		})
		await fakeNotifier.notifyPersonUpdates(initialPerson, updatedPerson)
		return nofificationLog
	}

	it('notifies when phone number is added', async () => {
		const log = await captureNotifications(
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
		const log = await captureNotifications(
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
		const log = await captureNotifications(
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
		const log = await captureNotifications(
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
		const log = await captureNotifications(
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
		const log = await captureNotifications(
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

describe('makePersonNotifier().notifyPersonUpdates() -> notifyEmailChanged()', () => {

	const captureNotifications = async (initialPerson: Person, updatedPerson: Person): Promise<Email[]> => {
		const nofificationLog: Email[] = []
		const fakeNotifier: PersonNotifier = makePersonNotifier({
			notifyEmailChanged: async (email?: Email) => (email && nofificationLog.push(email), true),
			notifyPhoneChanged: notImplemented,
		})
		await fakeNotifier.notifyPersonUpdates(initialPerson, updatedPerson)
		return nofificationLog
	}

	it('notifies when email is added', async () => {
		const log = await captureNotifications(
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
		const log = await captureNotifications(
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
		const log = await captureNotifications(
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
		const log = await captureNotifications(
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
		const log = await captureNotifications(
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
		const log = await captureNotifications(
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