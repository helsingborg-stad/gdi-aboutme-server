import { GdiCasesServer, GdiCasesServerCase } from './types'

interface GdiCasesServerCasesMapper {
	(subjectId: string, cases: GdiCasesServerCase[]): GdiCasesServerCase[]
}

export const createMappingGdiCasesServer = (inner: GdiCasesServer, map: GdiCasesServerCasesMapper): GdiCasesServer => ({
	listCasesBySubjectId: async (subjectId) => inner
		.listCasesBySubjectId(subjectId)
		.then(cases => map(subjectId, cases)),
})
