import { Email, PersonNotifier, Phone } from '../../types'
import { AmqpSession, createAmqpSession } from './amqp-session'
import { AmqpConfiguration, EmailChangedMessage, PhoneChangedMessage } from './types'


const withEmail = async (email: Email|null, action: ((message: EmailChangedMessage) => Promise<boolean>) ): Promise<boolean> => 
{
	if (email) {
		const { address, verificationCode, isVerified, verifiedDate } = email
		if (address && verificationCode) {
			return await action({ address, verificationCode, isVerified, verifiedDate })
		}
	}
	return false
}

const withPhone = async (phone: Phone|null, action: ((message: PhoneChangedMessage) => Promise<boolean>) ): Promise<boolean> => 
{
	if (phone) {
		const { number, verificationCode, isVerified, verifiedDate } = phone
		if (number && verificationCode) {
			return await action({ number, verificationCode, isVerified, verifiedDate })
		}
	}
	return false
}

const createPersonNotifierOnAmqpSession = ({ notifyEmailTopic, notifyPhoneTopic }: AmqpConfiguration, session: AmqpSession): PersonNotifier => ({
	notifyEmailChanged: async (email?: Email) => withEmail(email, message => session.publish<EmailChangedMessage>(notifyEmailTopic, message).then(() => true)),
	notifyPhoneChanged: async (phone?: Phone) => withPhone(phone, message => session.publish<PhoneChangedMessage>(notifyPhoneTopic, message).then(() => true)),
})

/**
 * Create Person Notifier that published changes to AMQP given uri and exhcange
 */
export const createAmqpPersonNotifier = (config: AmqpConfiguration): PersonNotifier => 
	createPersonNotifierOnAmqpSession(config, createAmqpSession(config))