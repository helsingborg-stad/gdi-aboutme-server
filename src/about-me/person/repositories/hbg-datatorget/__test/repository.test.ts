import { createDefaultPersonUpdater } from '../../../updaters/index'
import { createHbgDatatorgetPersonRepository } from '../hbg-datatorget-person-respository'
import { PersonInformation, RestClient } from '../rest-api'

const notImplemented = () => { throw new Error('not implemented') }

const createRepo = (client: Partial<RestClient>) => createHbgDatatorgetPersonRepository({
	getPerson: notImplemented,
	updateContactDetails: notImplemented,
	verifyContactDetails: notImplemented,
	...client,
}, createDefaultPersonUpdater())

const typed = <T>(value: T): T => value

describe('createHbgDatatorgetPersonRepository()', () => {
	it('getPerson() delegates to REST api', async () => {
		const fakeGetPerson = jest.fn().mockReturnValue(Promise.resolve(
			typed<PersonInformation>({
				person_id: 'pid-123',
				social_security_number: 'ssn-123',
				first_name: 'Tiger',
				last_name: 'Stripes',
				contact_information: [],
			})))
		const repo = createRepo({
			getPerson: fakeGetPerson,
		})
		const p = await repo.getPerson('123')
		
		expect(p).toMatchObject({ 
			firstName: 'Tiger',
			lastName: 'Stripes',
			id: 'ssn-123',
		})
		expect(fakeGetPerson).toHaveBeenCalledWith('123')
		expect(fakeGetPerson).toHaveBeenCalledTimes(1)
	})

	it('verifyEmail() -> verifyContactDetails()', async () => {
		const fakeVerifyContactDetails = jest.fn().mockReturnValueOnce(Promise.resolve({ firstName: 'Tiger' }))
		const repo = createRepo({
			verifyContactDetails: fakeVerifyContactDetails,
		})

		await repo.verifyEmail('vc-123')
		expect(fakeVerifyContactDetails).toHaveBeenCalledWith('vc-123')
	})

	it('verifyPhone() -> verifyContactDetails()', async () => {
		const fakeVerifyContactDetails = jest.fn().mockReturnValueOnce(Promise.resolve({ firstName: 'Tiger' }))
		const repo = createRepo({
			verifyContactDetails: fakeVerifyContactDetails,
		})

		await repo.verifyPhone('vc-123')
		expect(fakeVerifyContactDetails).toHaveBeenCalledWith('vc-123')
	})
})