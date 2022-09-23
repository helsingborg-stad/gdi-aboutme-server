export const getTokenFromAuthorizationHeader = (headers: Record<string, string|string[]>) => 
(/^Bearer\s(.+)$/gmi).exec(headers?.authorization as string)?.[1]?.trim() || null

