import Debug from 'debug'
import { PersonNotifier } from '../types'
const debug = Debug('application:person-notifier')

export const createNullPersonNotifier = (): PersonNotifier => ({
	notifyEmailChanged: email => debug(email),
})
