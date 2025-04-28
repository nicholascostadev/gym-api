import { verifyJWT } from "@/http/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";
import { createController } from "./create";
import { nearbyController } from "./nearby";
import { searchController } from "./search";

export async function gymsRoutes(app: FastifyInstance) {
	app.addHook("onRequest", verifyJWT);

	app.post("/gyms", createController);
	app.get("/gyms/search", searchController);
	app.get("/gyms/nearby", nearbyController);
}
