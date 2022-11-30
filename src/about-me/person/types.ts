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
	verifyEmail: (verificationCode: string) => Promise<Person|null>
	verifyPhone: (verificationCode: string) => Promise<Person|null>
	notifyEmail: (id: string) => Promise<boolean>
	notifyPhone: (id: string) => Promise<boolean>
	checkHealth: () => Promise<boolean>
}

export interface PersonUpdater {
	notifier?: PersonNotifier
	updatePerson: (person: Person, update: PersonInput) => Promise<Person>
}

export interface PersonNotifier {
	notifyEmailChanged: (email?: Email) => Promise<boolean>
	notifyPhoneChanged: (phone?: Phone) => Promise<boolean>
}