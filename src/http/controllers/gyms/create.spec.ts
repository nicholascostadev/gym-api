import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Create Gym (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to create gym", async () => {
		const { token } = await createAndAuthenticateUser(app, "ADMIN");

		const response = await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Gym 1",
				description: "Gym 1 description",
				phone: "1234567890",
				latitude: -27.272727,
				longitude: -49.646464,
			});

		expect(response.statusCode).toEqual(201);
	});
});
