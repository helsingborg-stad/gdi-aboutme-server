import { getEnv } from '@helsingborg-stad/gdi-api-node'
import { PersonNotifier } from '../../types'
import { createAmqpPersonNotifier } from './amqp-person-notifier'

export { createAmqpPersonNotifier }

/**
 * Create Person Notifier if AMQP is configured via
 * AMQP_URI and AMQP_EXCHANGE
 */
export const tryCreateAmqpPersonNotifierFromEnv = (): PersonNotifier => {
	const uri = getEnv('AMQP_URI', { trim: true, fallback: '' })
	const exchange = getEnv('AMQP_EXCHANGE', { trim: true, fallback: '' })
	const notifyEmailTopic = getEnv('AMQP_NOTIFY_EMAIL_TOPIC', { trim: true, fallback: 'notify.email' })
	const notifyPhoneTopic = getEnv('AMQP_NOTIFY_PHONE_TOPIC', { trim: true, fallback: 'notify.phone' })
	if (uri && exchange) {
		return createAmqpPersonNotifier({ uri, exchange, notifyEmailTopic, notifyPhoneTopic })
	}
}