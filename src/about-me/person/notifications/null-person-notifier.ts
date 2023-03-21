import Debug from 'debug'
import { PersonNotifier } from '../types'
import { makePersonNotifier } from './make-person-notifier'
const debug = Debug('application:person-notifier')

export const createNullPersonNotifier = (): PersonNotifier => makePersonNotifier({
	notifyEmailChanged: email => debug(email),
	notifyPhoneChanged: phone => debug(phone),
})
