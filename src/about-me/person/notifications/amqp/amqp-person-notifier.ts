import { Email, PersonNotifier, Phone } from '../../types'
import { AmqpSession, createAmqpSession } from './amqp-session'
import { AmqpConfiguration } from './types'


const createPersonNotifierOnAmqpSession = ({ notifyEmailTopic, notifyPhoneTopic }: AmqpConfiguration, session: AmqpSession): PersonNotifier => ({
	notifyEmailChanged: (email: Email) => session.publish(notifyEmailTopic, email),
	notifyPhoneChanged: (phone: Phone) => session.publish(notifyPhoneTopic, phone),
})	

/**
 * Create Person Notifier that published changes to AMQP given uri and exhcange
 */
export const createAmqpPersonNotifier = (config: AmqpConfiguration): PersonNotifier => 
	createPersonNotifierOnAmqpSession(config, createAmqpSession(config))