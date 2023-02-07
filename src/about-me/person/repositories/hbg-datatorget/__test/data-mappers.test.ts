import { toPerson } from '../'
import { Person } from '../../../types'
import { CATEGORY_PRIVATE, ContactInformation, CONTACT_TYPE_EMAIL, CONTACT_TYPE_PHONE, PersonInformation } from '../rest-api'


const makePersonInformation = (pi: Partial<PersonInformation>): PersonInformation => ({
	person_id: '',
	first_name: '',
	last_name: '',
	social_security_number: '',
	contact_information: [],
	...pi,
})

const makeContactInformation = (ci: Partial<ContactInformation>): ContactInformation => ({
	category_id: CATEGORY_PRIVATE,
	contact_type_id: -1,
	contact_value: '',
	is_verified: false,
	verified_date: '',
	verification_code: '',
	category_name: '',
	contact_type_name: '',
	...ci,
})

describe('toPerson', () => {
	const verify = (actual: Partial<PersonInformation>, expectedMapping: Partial<Person>) => 
		expect(toPerson(makePersonInformation(actual))).toMatchObject(expectedMapping)

	it('maps email and phone (verified)', () => {
		verify({
			contact_information: [
				makeContactInformation({
					contact_type_id: CONTACT_TYPE_EMAIL,
					contact_value: 'a@b.com',
					is_verified: true,
					verified_date: '2020-02-02',
				}),
				makeContactInformation({
					contact_type_id: CONTACT_TYPE_PHONE,
					contact_value: '123-456',
					is_verified: true,
					verified_date: '2030-03-03',
				}),
			],
		},
		{
			email: { address: 'a@b.com', isVerified: true, verifiedDate: '2020-02-02' },
			phone: { number: '123-456', isVerified: true, verifiedDate: '2030-03-03' },
		})
	})
	it('maps email (unverified)', () => {
		verify({
			contact_information: [
				makeContactInformation({
					contact_type_id: CONTACT_TYPE_EMAIL,
					contact_value: 'b@c.com',
					is_verified: false,
					verification_code: 'vc-123',
				}),
				makeContactInformation({
					contact_type_id: CONTACT_TYPE_PHONE,
					contact_value: '123-456',
					is_verified: false,
					verification_code: 'vc-789',
				}),
			],
		},
		{
			email: {
				address: 'b@c.com',
				isVerified: false,
				verificationCode: 'vc-123',
			},
			phone: {
				number: '123-456',
				isVerified: false,
				verificationCode: 'vc-789',
			},
		})
	})

	it('should map', () => {
		const mapped = toPerson(
			{
				person_id: 'pid-123',
				first_name: 'John',
				last_name: 'Doe',
				social_security_number: 'ssn-123',
				contact_information: [
					makeContactInformation({
						contact_type_id: CONTACT_TYPE_EMAIL,
						contact_value: 'a@b.com',
						is_verified: true,
					}),
					makeContactInformation({
						contact_type_id: CONTACT_TYPE_PHONE,
						contact_value: '123-456',
						is_verified: true,
					}),
				],
			})
		expect(mapped).toMatchObject({
			firstName: 'John',
			lastName: 'Doe',
			id: 'ssn-123',
			email: {
				address: 'a@b.com',
				isVerified: true,
			},
			phone: {
				number: '123-456',
				isVerified: true,
			},
		})
	})
})