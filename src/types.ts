import { PersonRepository } from './about-me/person-repository/types'
import { AuthorizationService } from '@helsingborg-stad/gdi-api-node/services/authorization-service'

export interface AboutMeServices {
    authorization: AuthorizationService
    persons: PersonRepository
}