import * as request from 'supertest'
import * as jwt from 'jsonwebtoken'
import { createAboutMeApp } from "../../aboutme-app"
import { createAuthorizationService } from "../../framework/services/authorization-service"

const TEST_SHARED_SCERET = 'a shared secret for the tests in this file'

const createTestApp = () => createAboutMeApp({
    validateResponse: true,
    services: {
        authorization: createAuthorizationService(TEST_SHARED_SCERET)
    }
})

const createAuthorizationHeadersFor = (id: string, secret: string = TEST_SHARED_SCERET) => ({
    authorization: `Bearer ${jwt.sign({id}, secret)}`
})

describe('/aboutme/graphql', () => {
    it('gives 401 if no bearer token is supplied', () => createTestApp().run(
        async server => {
            const {status, body: {data}} = await request(server)
                .post('/api/v1/aboutme/graphql')
                .send({
                    query: `
                        query MyQuery {
                            me {
                                id
                            }
                        }`,
                    parameters: {}
                })
                
            expect(status).toBe(401)
        }))
    it('gives 401 if invalid bearer token is supplied', () => createTestApp().run(
        async server => {
            const {status, body: {data}} = await request(server)
                .post('/api/v1/aboutme/graphql')
                .set(createAuthorizationHeadersFor('test-person-id-123', 'WRONG SIGNING KEY'))
                .send({
                    query: `
                        query MyQuery {
                            me {
                                id
                            }
                        }`,
                    parameters: {}
                })
                
            expect(status).toBe(401)
        }))
    
    it('extracts user id from bearer token', () => createTestApp().run(
        async server => {
            const {status, body: {data}} = await request(server)
                .post('/api/v1/aboutme/graphql')
                .set(createAuthorizationHeadersFor('test-person-id-123'))
                .send({
                    query: `
                        query MyQuery {
                            me {
                                id
                            }
                        }`,
                    parameters: {}
                })
                
            expect(status).toBe(200)
            expect(data).toMatchObject({
                me: {
                    id: 'test-person-id-123',
                }
            })
        }
    ))
})