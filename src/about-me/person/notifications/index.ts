import { PersonNotifier } from '../types'
import { tryCreateAmqpPersonNotifierFromEnv } from './amqp/index'
import { createNullPersonNotifier } from './null-person-notifier'

export { createNullPersonNotifier }

/**
 * create a nofifier with flavour that best matches environment variable configuration
 */
export const createPersonNotifierFromEnv = (): PersonNotifier => tryCreateAmqpPersonNotifierFromEnv() || createNullPersonNotifier()

/**
 * create a nofifier that does nothing (besides possibly debug logging)
 */
export const ceateDefaultPersonNotifier = (): PersonNotifier => createNullPersonNotifier()
