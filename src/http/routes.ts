import type { FastifyInstance } from "fastify";
import { authenticateController } from "./controllers/authenticate";
import { profileController } from "./controllers/profile";
import { registerController } from "./controllers/register";
import { verifyJWT } from "./middlewares/verify-jwt";

export async function appRoutes(app: FastifyInstance) {
	app.post("/users", registerController);
	app.post("/sessions", authenticateController);

	// Authenticated routes
	app.get("/me", { onRequest: [verifyJWT] }, profileController);
}
