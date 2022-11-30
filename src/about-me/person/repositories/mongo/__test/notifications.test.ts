import { cleanupTestRepos, createTestRepo } from './mongo-test-utils'

afterAll(cleanupTestRepos)

describe('mongoPersonRepository notifications', () => {
	it('updatePerson() notifies about email', async () => {
		const notifyLog = []
		const repo = createTestRepo(notifyLog)
		await repo.updatePerson('test-person-123', { email: 'a@b.com' })
		expect(notifyLog).toHaveLength(1)
		expect(notifyLog[0]).toMatchObject({
			address: 'a@b.com',
			isVerified: false,
		})
	})

	it('updatePerson() notifies about phone', async () => {
		const notifyLog = []
		const repo = createTestRepo(notifyLog)
		await repo.updatePerson('test-person-123', { phoneNumber: '+4672123456' })
		expect(notifyLog).toHaveLength(1)
		expect(notifyLog[0]).toMatchObject({
			number: '+4672123456',
			isVerified: false,
		})
	})

	it('updatePerson() notifies about phone', async () => {
		const notifyLog = []
		const repo = createTestRepo(notifyLog)
		await repo.updatePerson('test-person-123', { phoneNumber: '+4672123456' })
		// console.log({ notifyLog })
		expect(notifyLog).toHaveLength(1)
		expect(notifyLog[0]).toMatchObject({
			number: '+4672123456',
			isVerified: false,
		})
	})

	it('notifyEmail() does nothing is person is unknown', async () => {
		const notifyLog = []
		const repo = createTestRepo(notifyLog)
		await repo.notifyEmail('missing-person')
		expect(notifyLog).toHaveLength(0)
	})

	it('notifyPhone() does nothing is person is unknown', async () => {
		const notifyLog = []
		const repo = createTestRepo(notifyLog)
		await repo.notifyPhone('missing-person')
		expect(notifyLog).toHaveLength(0)
	})

	it('notifyEmail() notifies with email', async () => {
		const notifyLog = []
		const repo = createTestRepo(notifyLog)
		await repo.updatePerson('test-person-123', { email: 'a@b.com' })
		// log now contains 1 entry
		await repo.notifyEmail('test-person-123')
		// log now contains 2 entries
		expect(notifyLog).toHaveLength(2)
		expect(notifyLog[1]).toMatchObject({
			address: 'a@b.com',
			isVerified: false,
		})
	})

	it('notifyPhone() notifies with phone', async () => {
		const notifyLog = []
		const repo = createTestRepo(notifyLog)
		await repo.updatePerson('test-person-123', { phoneNumber: '+4672123456' })
		// log now contains 1 entry
		await repo.notifyPhone('test-person-123')
		// log now contains 2 entries
		expect(notifyLog).toHaveLength(2)
		expect(notifyLog[1]).toMatchObject({
			number: '+4672123456',
			isVerified: false,
		})
	})
})