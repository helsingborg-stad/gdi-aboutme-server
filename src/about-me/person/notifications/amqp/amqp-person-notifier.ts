import { Email, PersonNotifier, Phone } from '../../types'
import { AmqpSession, createAmqpSession } from './amqp-session'
import { AmqpConfiguration, EmailChangedMessage, PhoneChangedMessage } from './types'


const createPersonNotifierOnAmqpSession = ({ notifyEmailTopic, notifyPhoneTopic }: AmqpConfiguration, session: AmqpSession): PersonNotifier => ({
	notifyEmailChanged: ({ address, verificationCode, isVerified, verifiedDate }: Email) => session.publish<EmailChangedMessage>(notifyEmailTopic, { address, verificationCode, isVerified, verifiedDate }),
	notifyPhoneChanged: ({ number, verificationCode, isVerified, verifiedDate }: Phone) => session.publish<PhoneChangedMessage>(notifyPhoneTopic, { number, verificationCode, isVerified, verifiedDate }),
})	

/**
 * Create Person Notifier that published changes to AMQP given uri and exhcange
 */
export const createAmqpPersonNotifier = (config: AmqpConfiguration): PersonNotifier => 
	createPersonNotifierOnAmqpSession(config, createAmqpSession(config))