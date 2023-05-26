import { getEnv } from '@helsingborg-stad/gdi-api-node'
import { GdiCasesServer, GdiCasesServerCase } from './types'
import request from 'superagent'
import { createMappingGdiCasesServer } from './mapping-gdi-cases-server'
import { createSampleCases } from './sample-cases'

const makeUrl = (url: string, base: string) => new URL(url, base).toString()

export const createGdiCasesServer = ({ url, apiKey }: {url: string, apiKey: string}): GdiCasesServer => ({
	listCasesBySubjectId: subjectId => request
		.get(makeUrl(`/api/v1/cases/list/${encodeURIComponent(subjectId)}`, url))
		.trustLocalhost()
		.accept('application/json')
		.auth(apiKey, { type: 'bearer' })
		.then(({ body }) => body as GdiCasesServerCase[]),
		
	markAsRead: recordId => request
		.post(makeUrl(`/api/v1/cases/stats/mark-as-read/${encodeURIComponent(recordId)}`, url))
		.trustLocalhost()
		.auth(apiKey, { type: 'bearer' })
		.then(() => void 0),
})

export const createNullGdiCasesServer = (): GdiCasesServer => ({
	listCasesBySubjectId: async () => ([]),
	markAsRead: async () => void 0,
})

export const createGdiCasesServerFromEnv = (): GdiCasesServer => {
	const [ url, apiKey, fallbackToSamples ] = [
		getEnv('GDICASES_URI', { trim: true, fallback: '' }),
		getEnv('GDICASES_APIKEY', { trim: true, fallback: '' }),
		getEnv('GDICASES_FALLBACK_TO_SAMPLES', { trim: true, fallback: '' }) ]

	const dontMapCases = (subjectId: string, cases: GdiCasesServerCase[]): GdiCasesServerCase[] => cases
	const mapEmptyToSamples = (subjectId: string, cases: GdiCasesServerCase[]): GdiCasesServerCase[] => cases.length > 0 ? cases : createSampleCases(subjectId)


	return createMappingGdiCasesServer(
		url && apiKey
			? createGdiCasesServer({ url, apiKey })
			: createNullGdiCasesServer(),

		fallbackToSamples ?  mapEmptyToSamples : dontMapCases
	)
}