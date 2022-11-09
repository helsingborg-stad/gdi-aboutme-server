export interface GdiCasesServerCase {
	caseId: string
	subjectId: string
	publisherStatus: string
	status: string
	updateTime: string
	label: string
	description: string
	events: GdiCasesServerCaseEvent[]
}
export interface GdiCasesServerCaseEvent {
	updateTime: string
	label: string
	description: string
	actions: GdiCasesServerCaseAction[]
}

export interface GdiCasesServerCaseAction {
	label: string
	url: string
}

export interface GdiCasesServer {
	listCasesBySubjectId: (subjectId: string) => Promise<GdiCasesServerCase[]>
}