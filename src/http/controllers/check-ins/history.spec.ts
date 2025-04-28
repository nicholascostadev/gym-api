import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

describe("History of Check-ins (e2e)", () => {
	beforeAll(async () => {
		await app.ready();

		vi.useFakeTimers();
	});

	afterAll(async () => {
		await app.close();

		vi.useRealTimers();
	});

	it("should be able to list the history of check-ins", async () => {
		vi.setSystemTime(new Date(2022, 0, 10, 8, 0, 0));
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

		vi.setSystemTime(new Date(2022, 0, 10, 8, 21, 0));

		const checkIn2 = await request(app.server)
			.post(`/gyms/${gym.body.gym.id}/check-ins`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				latitude: 54.9478114,
				longitude: -10.2312044,
			});

		const checkInHistoryResponse = await request(app.server)
			.get("/check-ins/history")
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(checkInHistoryResponse.statusCode).toEqual(200);
		expect(checkInHistoryResponse.body.checkIns).toHaveLength(2);
		expect(checkInHistoryResponse.body.checkIns).toEqual([
			expect.objectContaining({
				id: checkIn.body.checkIn.id,
			}),
			expect.objectContaining({
				id: checkIn2.body.checkIn.id,
			}),
		]);
	});
});
