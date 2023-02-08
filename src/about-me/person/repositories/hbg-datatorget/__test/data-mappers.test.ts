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

const makeEmail = (contact_value = '', is_verified = false, verified_date = '', verification_code = '') => makeContactInformation({
	contact_type_id: CONTACT_TYPE_EMAIL,
	contact_value, is_verified, verified_date, verification_code,
})

const makePhone = (contact_value = '', is_verified = false, verified_date = '', verification_code = '') => makeContactInformation({
	contact_type_id: CONTACT_TYPE_PHONE,
	contact_value, is_verified, verified_date, verification_code,
})

describe('toPerson (which maps from REST API model to internal Person model)', () => {
	const testToPerson = (actual: Partial<PersonInformation>, expectedMapping: Partial<Person>) => 
		expect(toPerson(makePersonInformation(actual))).toMatchObject(expectedMapping)

	it('maps email and phone (verified)', () => testToPerson({
		contact_information: [
			makeEmail('a@b.com', true, '2020-02-02'),
			makePhone('123-456', true, '2030-03-03'),
		],
	},
	{
		email: { address: 'a@b.com', isVerified: true, verifiedDate: '2020-02-02' },
		phone: { number: '123-456', isVerified: true, verifiedDate: '2030-03-03' },
	}))
	
	it('maps email and phone (unverified)', () => testToPerson({
		contact_information: [
			makePhone('123-456', false, '', 'vc-789'),
			makeEmail('b@c.com', false, '', 'vc-123'),
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
	}))

	it('maps only first found email', () => testToPerson(
		{
			contact_information: [ makeEmail('a@a.com'), makeEmail('b@b.com'), makeEmail('c@c.com') ],
		},
		{
			email: {
				address: 'a@a.com',
			},
		}
	))

	it('maps only first found phone', () => testToPerson(
		{
			contact_information: [ makePhone('123-456'), makePhone('555-666'), makePhone('555-777') ],
		},
		{
			phone: {
				number: '123-456',
			},
		}
	))

	it('allows for missing mail and phone', () => testToPerson({}, {
		email: null,
		phone: null,
	}))

	it('naive, verbose, match test', () => {
		const mapped = toPerson(
			{
				person_id: 'pid-123',
				first_name: 'John',
				last_name: 'Doe',
				social_security_number: 'ssn-123',
				contact_information: [
					{
						contact_type_id: CONTACT_TYPE_EMAIL,
						contact_value: 'a@b.com',
						is_verified: true,
						category_id: CATEGORY_PRIVATE,
						verified_date: '',
						verification_code: '',
						category_name: '',
						contact_type_name: '',
					},
					{
						contact_type_id: CONTACT_TYPE_PHONE,
						contact_value: '123-456',
						is_verified: true,
						category_id: CATEGORY_PRIVATE,
						verified_date: '',
						verification_code: '',
						category_name: '',
						contact_type_name: '',
					},
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