import { makeFetchNearbyGymsService } from "@/services/factories/make-fetch-nearby-gyms-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function nearbyController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const nearbyGymsQuerySchema = z.object({
		latitude: z.coerce.number().refine((value) => {
			return Math.abs(value) <= 90;
		}),
		longitude: z.coerce.number().refine((value) => {
			return Math.abs(value) <= 180;
		}),
	});

	const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query);

	const nearbyGymsService = makeFetchNearbyGymsService();

	const { gyms } = await nearbyGymsService.execute({
		userLatitude: latitude,
		userLongitude: longitude,
	});

	return reply.status(200).send({ gyms });
}
