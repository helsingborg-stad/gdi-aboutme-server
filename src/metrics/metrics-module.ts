import { ApplicationContext, ApplicationModule } from '@helsingborg-stad/gdi-api-node'
import { ApplicationExtension } from '@helsingborg-stad/gdi-api-node/application'
import { collectDefaultMetrics, Counter, Registry } from 'prom-client'
import { readFile } from 'fs/promises'

const mapValues = <T, S>(o: Record<string, T>, map: ((k: string, v: T) => S)) => 
	Object.fromEntries(Object.entries(o).map(([ k, v ]) => ([ k, map(k, v) ])))


const createMetricsExtension = ({	register, prefix }: {register: Registry, prefix: string}): ApplicationExtension => {
	let counters: Record<string, Counter> = {}
	return {
		compose: mv => (ctx, next) => {
			const operationId = ctx.apiContext?.operation?.operationId
			counters[operationId]?.inc()
			return mv(ctx, next)
		},
		mapApi: async api => {
			// we create a mapping from operationId to counter
			// one we know all api operations
			counters = mapValues(api, operationId => new Counter({
				name: `${prefix}${operationId}`,
				help: `Calls made to API operation ${operationId}`,
				registers: [register],
			}))

			return api
		},
	}
}

const getPrefix = async (): Promise<string> => {
	const { name } = JSON.parse(await readFile('./package.json', { encoding: 'utf8' }))
	return (name as string).replace(/-/ig, '_') + '_'
}

export const metricsModule = (): ApplicationModule => async ({ router, extend }: ApplicationContext) => {
	const prefix = await getPrefix()
	const register = new Registry()
	collectDefaultMetrics({ register, prefix })

	register.setDefaultLabels({
		env: process.env.NODE_ENV || 'production',
	})


	extend(createMetricsExtension({ register, prefix }))
	router.get('/metrics', async ctx => {
		ctx.type = register.contentType
		ctx.body = await register.metrics()
	})
}
