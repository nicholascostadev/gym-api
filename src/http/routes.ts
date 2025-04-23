import type { FastifyInstance } from "fastify";
import { authenticateController } from "./controllers/authenticate";
import { registerController } from "./controllers/register";

export async function appRoutes(app: FastifyInstance) {
	app.post("/users", registerController);

	app.post("/sessions", authenticateController);
}
