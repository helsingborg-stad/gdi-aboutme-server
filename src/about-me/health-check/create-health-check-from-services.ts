import { AboutMeServices } from '../../types'

export const createHealthCheckFromServices = (services: AboutMeServices) => async (ns: string) => {
	return await services.persons.checkHealth()
}
