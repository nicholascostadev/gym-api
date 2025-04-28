import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Search Gyms (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to search gyms by title", async () => {
		const { token } = await createAndAuthenticateUser(app, "ADMIN");

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "TS Gym",
				description: "TS Gym description",
				phone: "1234567890",
				latitude: -27.272727,
				longitude: -49.646464,
			});

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "JS Gym",
				description: "JS Gym description",
				phone: "1234567890",
				latitude: -27.272727,
				longitude: -49.646464,
			});

		const response = await request(app.server)
			.get("/gyms/search")
			.query({
				q: "TS",
			})
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: "TS Gym",
			}),
		]);
	});
});
