import { PersonNotifier } from '../types'
import { createNullPersonNotifier } from './null-person-notifier'

export { createNullPersonNotifier }

/**
 * create a nofifier with flavour that best matches environment variable configuration
 */
export const createPersonNotifierFromEnv = (): PersonNotifier => createNullPersonNotifier()

/**
 * create a nofifier that does nothing (besides possibly debug logging)
 */
export const ceateDefaultPersonNotifier = (): PersonNotifier => createNullPersonNotifier()
