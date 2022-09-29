export interface Email {
	address: string
	isVerified: boolean
	verifiedDate: string
}
export interface Person {
	id: string
	firstName: string
	lastName: string
	email: Email
}

export interface PersonInput {
	email: string
}

export interface PersonRepository {
	getPerson: (id: string) => Person
	updatePerson(id: any, update: PersonInput): Person
}
