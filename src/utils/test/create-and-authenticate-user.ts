import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(
	app: FastifyInstance,
	role?: "ADMIN" | "MEMBER",
) {
	const user = await prisma.user.create({
		data: {
			name: "John Doe",
			email: "johndoe@example.com",
			password_hash: await hash("123456", 6),
			role: role ?? "MEMBER",
		},
	});

	const authResponse = await request(app.server).post("/sessions").send({
		email: "johndoe@example.com",
		password: "123456",
	});

	const { token } = authResponse.body;

	return { token };
}
