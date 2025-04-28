import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Metrics of Check-ins (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to list the metrics of check-ins", async () => {
		const { token } = await createAndAuthenticateUser(app);
		const user = await prisma.user.findFirstOrThrow();

		const gym = await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Gym 1",
				description: "Gym 1 description",
				phone: "1234567890",
				latitude: 54.9478114,
				longitude: -10.2312044,
			});

		await prisma.checkIn.createMany({
			data: [
				{
					gym_id: gym.body.gym.id,
					user_id: user.id,
				},
				{
					gym_id: gym.body.gym.id,
					user_id: user.id,
				},
			],
		});

		const checkInHistoryResponse = await request(app.server)
			.get("/check-ins/metrics")
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(checkInHistoryResponse.statusCode).toEqual(200);
		expect(checkInHistoryResponse.body.checkInsCount).toEqual(2);
	});
});
