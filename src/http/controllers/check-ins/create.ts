import { makeCheckInService } from "@/services/factories/make-check-in-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const createCheckInParamsSchema = z.object({
		gymId: z.string().uuid(),
	});

	const createCheckInBodySchema = z.object({
		latitude: z.number().refine((value) => {
			return Math.abs(value) <= 90;
		}),
		longitude: z.number().refine((value) => {
			return Math.abs(value) <= 180;
		}),
	});

	const { gymId } = createCheckInParamsSchema.parse(request.params);
	const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

	const checkInService = makeCheckInService();

	await checkInService.execute({
		userId: request.user.sub,
		gymId,
		userLatitude: latitude,
		userLongitude: longitude,
	});

	return reply.status(201).send();
}
