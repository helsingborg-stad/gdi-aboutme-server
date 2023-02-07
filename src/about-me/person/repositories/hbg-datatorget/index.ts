import { getEnv } from '@helsingborg-stad/gdi-api-node'
import { PersonRepository, PersonUpdater } from '../../types'
import { createHbgDatatorgetPersonRepository } from './hbg-datatorget-person-respository'

export { toPerson } from './hbg-datatorget-person-respository'
export { toUpdateContactDetailsRequest, toVerifyContactDetailsRequest } from './rest-api'

export const tryCreateDatatorgetFrendsPersonRepositoryFromEnv = (updater: PersonUpdater): PersonRepository | null => {
	const uri = getEnv('HBG_DATATORGET_URI',{ trim: true, fallback: '' })
	const apiKey =  getEnv('HBG_DATATORGET_APIKEY',{ trim: true, fallback: '' })
	return uri && apiKey ? createHbgDatatorgetPersonRepository({ 
		uri,
		apiKey,
	}, updater) : null
}
