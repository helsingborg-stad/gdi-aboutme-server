import { createAuthorizationServiceFromEnv } from "../framework/services/authorization-service";
import { AboutMeServices } from "../types";

export const createServicesFromEnv = (): AboutMeServices => ({
    authorization: createAuthorizationServiceFromEnv()
})