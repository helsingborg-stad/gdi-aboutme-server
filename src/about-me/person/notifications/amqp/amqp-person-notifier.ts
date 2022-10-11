import { Email, PersonNotifier, Phone } from '../../types'
import { AmqpSession, createAmqpSession } from './amqp-session'
import { AmqpConfiguration } from './types'


const createPersonNotifierOnAmqpSession = ({ notifyEmailTopic, notifyPhoneTopic }: AmqpConfiguration, session: AmqpSession): PersonNotifier => ({
	notifyEmailChanged: ({ address, verificationCode }: Email) => session.publish(notifyEmailTopic, { address, verificationCode }),
	notifyPhoneChanged: ({ number, verificationCode }: Phone) => session.publish(notifyPhoneTopic, { number, verificationCode }),
})	

/**
 * Create Person Notifier that published changes to AMQP given uri and exhcange
 */
export const createAmqpPersonNotifier = (config: AmqpConfiguration): PersonNotifier => 
	createPersonNotifierOnAmqpSession(config, createAmqpSession(config))