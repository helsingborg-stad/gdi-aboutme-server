export interface AmqpConfiguration {
	uri: string,
	exchange: string,
	notifyEmailTopic: string,
	notifyPhoneTopic: string
}

export interface EmailChangedMessage {
	address: string
	verificationCode: string
	isVerified?: boolean
	verifiedDate?: string
}

export interface PhoneChangedMessage {
	number: string
	verificationCode: string
	isVerified?: boolean
	verifiedDate?: string
}
