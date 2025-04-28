import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Validate Check-in (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to validate check-in", async () => {
		const { token } = await createAndAuthenticateUser(app);

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

		const checkIn = await request(app.server)
			.post(`/gyms/${gym.body.gym.id}/check-ins`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				latitude: 54.9478114,
				longitude: -10.2312044,
			});

		const response = await request(app.server)
			.patch(`/check-ins/${checkIn.body.checkIn.id}/validate`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(204);

		const checkInDetails = await prisma.checkIn.findUniqueOrThrow({
			where: {
				id: checkIn.body.checkIn.id,
			},
		});

		expect(checkInDetails.validated_at).toEqual(expect.any(Date));
	});
});
