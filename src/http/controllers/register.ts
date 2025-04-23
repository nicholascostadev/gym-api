import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterService } from "@/services/register";
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

	try {
		const prismaUsersRepository = new PrismaUsersRepository();
		const registerService = new RegisterService(prismaUsersRepository);

		await registerService.execute({ name, email, password });
	} catch (error) {
		if (error instanceof Error) {
			return reply.status(409).send({ message: error.message });
		}
	}

	return reply.status(201).send();
}
