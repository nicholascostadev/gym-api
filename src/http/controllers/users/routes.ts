import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { authenticateController } from "./authenticate";
import { profileController } from "./profile";
import { refreshTokenController } from "./refresh";
import { registerController } from "./register";

export async function usersRoutes(app: FastifyInstance) {
	app.post("/users", registerController);
	app.post("/sessions", authenticateController);

	app.patch("/token/refresh", refreshTokenController);

	// Authenticated routes
	app.get("/me", { onRequest: [verifyJWT] }, profileController);
}
