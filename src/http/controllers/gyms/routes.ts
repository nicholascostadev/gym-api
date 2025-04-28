import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/veryify-user-role";
import type { FastifyInstance } from "fastify";
import { createController } from "./create";
import { nearbyController } from "./nearby";
import { searchController } from "./search";

export async function gymsRoutes(app: FastifyInstance) {
	app.addHook("onRequest", verifyJWT);

	app.post("/gyms", { onRequest: [verifyUserRole("ADMIN")] }, createController);
	app.get("/gyms/search", searchController);
	app.get("/gyms/nearby", nearbyController);
}
