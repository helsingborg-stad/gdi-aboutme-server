import { cleanupTestRepos, createTestRepo } from './mongo-test-utils'

afterAll(cleanupTestRepos)

describe('mongoPersonRepository verifications', () => {
	it('verifyEmail() does nothing if person is unknown', async () => {
		const repo = createTestRepo()
		const verified = await repo.verifyEmail('unknown-verification-code')
		expect(verified).toBeNull()
	})

	it('verifyPhone() does nothing if person is unknown', async () => {
		const repo = createTestRepo()
		const verified = await repo.verifyPhone('unknown-verification-code')
		expect(verified).toBeNull()
	})

	it('verifyEmail() updates person', async () => {
		const repo = createTestRepo()
		const { email: { verificationCode, isVerified } = { verificationCode: '' } } = await repo.updatePerson('test-person-123', { email: 'a@b.com' })
		expect(isVerified).toBeFalsy()
		
		const verified = await repo.verifyEmail(verificationCode as string)
		expect(verified).toMatchObject({
			id: 'test-person-123',
			email: {
				address: 'a@b.com',
				isVerified: true,
			},
		})
	} )

	it('verifyPhone() updates person', async () => {
		const repo = createTestRepo()
		const { phone: { verificationCode, isVerified } = { verificationCode: '' } } = await repo.updatePerson('test-person-123', { phoneNumber: '+467212345678' })
		expect(isVerified).toBeFalsy()
		
		const verified = await repo.verifyPhone(verificationCode as string)
		expect(verified).toMatchObject({
			id: 'test-person-123',
			phone: {
				number: '+467212345678',
				isVerified: true,
			},
		})
	} )
})