import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateService } from "@/services/authenticate";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentails-error";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticateController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const authenticateBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	});

	const { email, password } = authenticateBodySchema.parse(request.body);

	try {
		const prismaUsersRepository = new PrismaUsersRepository();
		const authenticateService = new AuthenticateService(prismaUsersRepository);

		await authenticateService.execute({ email, password });
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return reply.status(401).send({ message: error.message });
		}

		throw error;
	}

	return reply.status(200).send();
}
