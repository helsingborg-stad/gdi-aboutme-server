import { Email, PersonNotifier } from '../../types'
import { AmqpSession, createAmqpSession } from './amqp-session'
import { AmqpConfiguration } from './types'


const createPersonNotifierOnAmqpSession = ({ notifyEmailTopic }: AmqpConfiguration, session: AmqpSession): PersonNotifier => ({
	notifyEmailChanged: (email: Email) => session.publish(notifyEmailTopic, email),
})	

/**
 * Create Person Notifier that published changes to AMQP given uri and exhcange
 */
export const createAmqpPersonNotifier = (config: AmqpConfiguration): PersonNotifier => 
	createPersonNotifierOnAmqpSession(config, createAmqpSession(config))