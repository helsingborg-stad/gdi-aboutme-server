import { PersonRepository } from './about-me/person/types'
import { AuthorizationService } from '@helsingborg-stad/gdi-api-node/services/authorization-service'
import { GdiCasesServer } from './about-me/external-providers/gdi-cases-server/types'

export interface AboutMeServices {
    authorization: AuthorizationService
    persons: PersonRepository
    gdiCases?: GdiCasesServer
}