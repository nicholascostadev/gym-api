import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function registerController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const createUserBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
	});

	const { name, email, password } = createUserBodySchema.parse(request.body);

	const password_hash = await hash(password, 6);

	const userWithSameEmail = await prisma.user.findUnique({
		where: { email },
	});

	if (userWithSameEmail) {
		return reply.status(409).send({ message: "User already exists" });
	}

	await prisma.user.create({
		data: { name, email, password_hash },
	});

	return reply.status(201).send();
}
