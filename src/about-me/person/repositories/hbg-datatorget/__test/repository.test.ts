import { createDefaultPersonUpdater } from '../../../updaters/index'
import { createHbgDatatorgetPersonRepository } from '../hbg-datatorget-person-respository'
import { CATEGORY_PRIVATE, CONTACT_TYPE_EMAIL, CONTACT_TYPE_PHONE, PersonInformation, RestClient } from '../rest-api'

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
		const fakeGetPerson = jest.fn().mockResolvedValue(
			typed<PersonInformation>({
				person_id: 'pid-123',
				social_security_number: 'ssn-123',
				first_name: 'Tiger',
				last_name: 'Stripes',
				contact_information: [],
			}))
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

	it('updatePerson()', async () => {
		const fakeGetPerson = jest.fn().mockResolvedValue(
			typed<PersonInformation>({
				person_id: 'pid-123',
				social_security_number: '',
				first_name: 'John',
				last_name: 'Doe',
				contact_information: [],
			}))
		const fakeUpdateContactDetails = jest.fn()

		const repo = createRepo({
			getPerson: fakeGetPerson,
			updateContactDetails: fakeUpdateContactDetails,
		})

		await repo.updatePerson('pid-123', { email: 'a@b.com', phoneNumber: '123-456' })

		expect(fakeUpdateContactDetails).toHaveBeenCalledWith('pid-123', [
			{
				category_id: CATEGORY_PRIVATE,
				contact_type_id: CONTACT_TYPE_EMAIL,
				contact_type_value: 'a@b.com',
			},
			{
				category_id: CATEGORY_PRIVATE,
				contact_type_id: CONTACT_TYPE_PHONE,
				contact_type_value: '+46123456',
			},
		])
	})

	it('verifyEmail() -> verifyContactDetails()', async () => {
		const fakeVerifyContactDetails = jest.fn().mockResolvedValueOnce({ firstName: 'Tiger' })
		const repo = createRepo({
			verifyContactDetails: fakeVerifyContactDetails,
		})

		await repo.verifyEmail('vc-123')
		expect(fakeVerifyContactDetails).toHaveBeenCalledWith('vc-123')
	})

	it('verifyPhone() -> verifyContactDetails()', async () => {
		const fakeVerifyContactDetails = jest.fn().mockResolvedValueOnce({ firstName: 'Tiger' })
		const repo = createRepo({
			verifyContactDetails: fakeVerifyContactDetails,
		})

		await repo.verifyPhone('vc-123')
		expect(fakeVerifyContactDetails).toHaveBeenCalledWith('vc-123')
	})
})