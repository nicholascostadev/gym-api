import { makeGetUserProfileService } from "@/services/factories/make-get-user-profile-service";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function profileController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const getUserProfileService = makeGetUserProfileService();

	const { user } = await getUserProfileService.execute({
		userId: request.user.sub,
	});

	return reply.status(200).send({
		user: {
			...user,
			password_hash: undefined,
		},
	});
}
