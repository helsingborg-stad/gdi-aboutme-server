import { GdiCasesServerCase } from './types'

const makeCase = (subjectId: string, i: number, status: string, statusHint): GdiCasesServerCase => ({
	caseId: `sample-case-${i}`,
	subjectId,
	updateTime: '2023-01-01',
	organization: 'Exempelförvaltningen',
	label: 'Du har ett exempelärende',
	description: `Detta är ett exempelärende hos exempelförvaltningen. Lite simulerade exempeldetaljer är att ditt personnummer är ${subjectId} och det påhittade ärendenumret är ${i}.`,
	status,
	statusHint,
	events: [ {
		updateTime: new Date().toISOString(),
		label: 'Uppdatering',
		description: 'En påhittad exempelhandläggare uppdaterade detta exempelärende alldeles nyss',
		status: 'Uppdaterad',
		statusHint: '',
		actions: [{
			label: 'Visa mitt ärende i exempel-e-tjänsten',
			typeHint: 'link',
			url: 'https://www.example.com',
		}],
	}, {
		updateTime: '2023-01-01',
		label: 'Inkommet',
		description: 'Ditt exempelärende är registerat i vårt exempelverksamhessystem',
		status: 'Inkommet',
		statusHint: '',
		actions: [],
	} ],
	actions: [{
		label: 'Visa mitt ärende i exempel-e-tjänsten',
		typeHint: 'link',
		url: 'https://www.example.com',
	}],
})

export const createSampleCases = (subjectId: string): GdiCasesServerCase[] => ([
	makeCase(subjectId, 101, 'Godkänt', 'approved'),
	makeCase(subjectId, 202, 'Nekad', 'rejected'),
	makeCase(subjectId, 303, 'Avslutat', 'closed'),
	makeCase(subjectId, 404, 'Komplettering krävs', 'incomplete'),
])
