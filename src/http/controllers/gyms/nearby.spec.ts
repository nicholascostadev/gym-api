import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Nearby Gyms (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to list nearby gyms", async () => {
		const { token } = await createAndAuthenticateUser(app);

		// Create a gym nearby
		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Near Gym",
				description: "A gym that is near",
				phone: "1234567890",
				latitude: 51.9478114,
				longitude: -10.2312044,
			});

		// Create a gym far away
		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Far Gym",
				description: "A gym that is far away",
				phone: "0987654321",
				latitude: 54.9478114,
				longitude: -10.2312044,
			});

		const response = await request(app.server)
			.get("/gyms/nearby")
			.query({
				latitude: 51.9478114,
				longitude: -10.2312044,
			})
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: "Near Gym",
			}),
		]);
	});
});
