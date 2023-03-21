import { getEnv } from '@helsingborg-stad/gdi-api-node'
import { PersonNotifier, PersonRepository, PersonUpdater } from '../../types'
import { createHbgDatatorgetPersonRepository } from './hbg-datatorget-person-respository'
import { createRestClient } from './rest-api'

export { toPerson } from './hbg-datatorget-person-respository'
export { toUpdateContactDetailsRequest, toVerifyContactDetailsRequest } from './rest-api'

export const tryCreateDatatorgetFrendsPersonRepositoryFromEnv = (updater: PersonUpdater, notifier: PersonNotifier): PersonRepository | null => {
	const uri = getEnv('HBG_DATATORGET_URI',{ trim: true, fallback: '' })
	const apiKey =  getEnv('HBG_DATATORGET_APIKEY',{ trim: true, fallback: '' })
	return uri && apiKey ? createHbgDatatorgetPersonRepository(
		createRestClient({ uri, apiKey }), updater, notifier) : null
}
