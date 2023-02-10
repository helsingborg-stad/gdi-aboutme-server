export interface GdiCasesServerCase {
	caseId: string
	subjectId: string
	updateTime: string
	organization: string,
	label: string
	description: string
	status: string
	statusHint: string
	events: GdiCasesServerCaseEvent[]
	actions: GdiCasesServerCaseAction[]
}
export interface GdiCasesServerCaseEvent {
	updateTime: string
	label: string
	description: string
	status: string
	statusHint: string
	actions: GdiCasesServerCaseAction[]
}

export interface GdiCasesServerCaseAction {
	label: string
	url: string
	typeHint: string
}

export interface GdiCasesServer {
	listCasesBySubjectId: (subjectId: string) => Promise<GdiCasesServerCase[]>
}