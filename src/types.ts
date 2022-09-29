import { PersonRepository } from './about-me/person-repository/types'
import { AuthorizationService } from './framework/services/authorization-service'

export interface AboutMeServices {
    authorization: AuthorizationService
    persons: PersonRepository
}