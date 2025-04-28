import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { authenticateController } from "./authenticate";
import { profileController } from "./profile";
import { registerController } from "./register";

export async function usersRoutes(app: FastifyInstance) {
	app.post("/users", registerController);
	app.post("/sessions", authenticateController);

	// Authenticated routes
	app.addHook("onRequest", verifyJWT);
	app.get("/me", profileController);
}
