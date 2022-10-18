export interface Email {
	address: string
	isVerified?: boolean
	verifiedDate?: string
	verificationCode?: string
}

export interface Phone {
	number: string
	isVerified?: boolean
	verifiedDate?: string
	verificationCode?: string
}

export interface Person {
	id: string
	firstName?: string
	lastName?: string
	email?: Email
	phone?: Phone
}

export interface PersonInput {
	email?: string|null
	phoneNumber?: string|null
}

export interface PersonRepository {
	getPerson: (id: string, knownFromElseWhere?: () => Person) => Promise<Person>
	updatePerson: (id: any, update: PersonInput, knownFromElseWhere?: () => Partial<Person>) => Promise<Person>
	checkHealth: () => Promise<boolean>
}

export interface PersonUpdater {
	updatePerson: (person: Person, update: PersonInput) => Promise<Person>
}

export interface PersonNotifier {
	notifyEmailChanged: (email: Email) => Promise<any>
	notifyPhoneChanged: (phone: Phone) => Promise<any>
}