import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Create Check-in (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to create check-in", async () => {
		const { token } = await createAndAuthenticateUser(app, "ADMIN");

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

		const response = await request(app.server)
			.post(`/gyms/${gym.body.gym.id}/check-ins`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				latitude: 54.9478114,
				longitude: -10.2312044,
			});

		expect(response.statusCode).toEqual(201);
	});
});
