/******************************************************************************
 * 
 * Example AMQP listener
 * 
 * Defaults to read from environment (and .env), making it suitable for 
 * local confirmation and inspection of emmited messages.
 * 
 */

require('dotenv').config()
const amqp = require('amqplib')
const path = require('path')

const listen = async ({uri, exchange}) => {
	console.log(`connecting to ${uri}...`)
	const connection = await amqp.connect(uri)
	
	console.log('creating channel...')
	const channel = await connection.createChannel()

	console.log(`asserting durable topic exchange ${exchange}...`)
	await channel.assertExchange(exchange, 'topic', {durable: true})
	
	console.log('asserting transient queue...')
	const queue = await channel.assertQueue('', {exclusive: true})
	console.log(`got queue ${queue.queue}`)
	
	console.log('binding queue...')
	channel.bindQueue(queue.queue, exchange, '#');
		
	console.log('waiting for messages. Ctrl-C to exit...')
	while (true) {
		await channel.consume(queue.queue, msg => 
			console.log(`got message with routingkey = ${msg?.fields?.routingKey}\r\n${msg.content.toString()}\r\n`),
			{noAck: true})
		}
}

const showHelp = () => {
	console.log(
`

node ${path.basename(__filename)} --uri <amqp uri> --exchange <amqp exchange>
		--uri       defaults to AMPQP_URI
		--exchange  defaults to AMPQP_EXCHANGE
		--help      show this help
		Environment is loaded from .env on start.
`)
}

const getNamedArg = name => process.argv
	.map((v, i, a) => ({first: v, second: a[i+1]}))
	.filter(({first}) => first === name).map(({second}) => second)
	[0] || null

const hasArg = name => process.argv.includes(name)

const main = async () => {
	const uri = getNamedArg('--uri') || process.env.AMQP_URI
	const exchange = getNamedArg('--exchange') || process.env.AMQP_EXCHANGE

	if (hasArg('--help')) {
		return showHelp()
	}
	if (uri && exchange) {
		return listen({uri, exchange})
	}
	return showHelp()
}

main()
	.catch(err => console.error(err.stack))