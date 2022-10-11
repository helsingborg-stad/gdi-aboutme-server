import Debug from 'debug'
import amqp from 'amqplib'
import { AmqpConfiguration } from './types'
const debug = Debug('application:amqp-session')

export interface AmqpApi {
	publish: <T>(topic: string, payload: T) => Promise<any> 
}

export type AmqpApiHandler = (api: AmqpApi) => Promise<any>
export type AmqpSession = AmqpApi

const createAmqpApi = async ({ uri, exchange }: AmqpConfiguration): Promise<AmqpApi> => {
	const connection = await amqp.connect(uri)
	const channel = await connection.createConfirmChannel()
	await channel.assertExchange(exchange, 'topic', { durable: true })

	const publish = (topic: string, payload: any) => 
		(
			debug({ topic, payload }),
			channel.publish(
				exchange,
				topic,
				Buffer.from(JSON.stringify(payload, null, 2)),
				{ contentType: 'application/json' }))

	const api: AmqpApi = { publish }
	return api
}

export const createAmqpSession = (config: AmqpConfiguration): AmqpSession => {
	const eventualApi: Promise<AmqpApi> = createAmqpApi(config)
	return {
		publish: (topic, payload) => eventualApi.then(api => api.publish(topic, payload)),
	}
}
