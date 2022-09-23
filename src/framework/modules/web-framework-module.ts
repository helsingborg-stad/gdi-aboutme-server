import * as cors from '@koa/cors' 
import * as bodyparser from 'koa-bodyparser'
import { ApplicationContext, ApplicationModule } from '../types'

const webFramworkModule = (): ApplicationModule => ({ app }: ApplicationContext) => app
	.use(cors())
	.use(bodyparser())

export default webFramworkModule