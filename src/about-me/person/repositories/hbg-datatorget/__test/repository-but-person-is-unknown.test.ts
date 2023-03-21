import { createNullPersonNotifier } from '../../../notifications/null-person-notifier'
import { createDefaultPersonUpdater } from '../../../updaters/index'
import { createHbgDatatorgetPersonRepository } from '../hbg-datatorget-person-respository'
import { PersonInformation, RestClient } from '../rest-api'

const notImplemented = () => { throw new Error('not implemented') }

const createRepo = (client: Partial<RestClient>) => createHbgDatatorgetPersonRepository({
	getPerson: notImplemented,
	updateContactDetails: notImplemented,
	verifyContactDetails: notImplemented,
	...client,
}, 
createDefaultPersonUpdater(),
createNullPersonNotifier()
)

const setAdd = <T>(s: Set<T>, v: T) => s.has(v) ? false : (s.add(v), true)

const uniqueBy = <T>(predicate: ((v: T) => string), s?: Set<string>): ((v: T) => boolean) => 
	s ? (value: T) => setAdd(s, predicate(value)) : uniqueBy(predicate, new Set<string>())

const createFakeRestClient = (db: Record<string, PersonInformation>): RestClient => ({
	getPerson: async personId => db[personId] || null,
	updateContactDetails: async (personId, updates) => {
		const pi = db[personId]
		pi.contact_information = [
			...updates
				.map(({ category_id, contact_type_id, contact_value }) => ({
					category_id, contact_type_id, contact_value,
					category_name: '',
					contact_type_name: '',
				
					is_verified: false,
					verified_date: '',
					verification_code: '',
					contact_type_value: '',
				})),
			...pi.contact_information,
		]
			.filter(uniqueBy(ci => ([ ci.category_id, ci.contact_type_id ].join(':'))))
	},
	verifyContactDetails: async (...verificationCodes) => {
		const c = new Set(verificationCodes)
		Object
			.values(db)
			.map(({ contact_information }) => contact_information)
			.reduce((c, l) => c.concat(l), [])
			.filter(({ verification_code } )=> c.has(verification_code))
			.forEach(ci => ci.is_verified = true)
	},
})

describe('createHbgDatatorgetPersonRepository()', () => {
	it('getPerson(<unknown person>) => undefined', async () => {
		const repo = createRepo(createFakeRestClient({}))
		const p = await repo.getPerson('ssn-123')
		expect(p).toBeFalsy()
	})

	it('getPerson() doesnt call supplied data callback', async () => {
		const repo = createRepo(createFakeRestClient({}))
		const p = await repo.getPerson('ssn-123', () => { throw new Error('Unexpected call')})
		expect(p).toBeNull()
	})
	it('getPerson() doesnt call supplied data callback', async () => {
		const repo = createRepo(createFakeRestClient({}))
		const p = await repo.getPerson('ssn-123', () => ({ id: 'ssn-123', firstName: 'John', lastName: 'Doe' }))
		expect(p).toBeNull()
	})
})
