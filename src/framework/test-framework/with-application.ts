import { Server } from "node:http"
import { Application } from "../types"

const TEST_PORT = 4444

export const withApplication = async (application: Application, handler: (server: Server) => Promise<void>): Promise<void> => {
	const server = await application.start(TEST_PORT)
	try {
		await handler(server)
	} finally {
		await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve(null)))
	}
}
