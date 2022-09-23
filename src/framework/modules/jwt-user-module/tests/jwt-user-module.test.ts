import * as request from 'supertest'
import { createApplication } from "../../../application"
import { AuthorizationService, createAuthorizationService } from "../../../services/authorization-service"
import { withApplication } from "../../../test-framework/with-application"
import { jwtUserModule } from ".."

const createTestApp = (authorization: AuthorizationService) => createApplication({
    openApiDefinitionPath: './openapi.yml',
    validateResponse: true
})
    .use(jwtUserModule(authorization))

describe('jwt-user-module', () => {
    it('ignores apa', async () => withApplication(
        createTestApp(createAuthorizationService('test shared secret')),
        async server => {
			const { status } = await request(server)
				.get('/some/page/it/can/be/anyone/actally')
                .set('Authorization', 'Bearer apa')
            expect(status).toBe(401)
        }))
})