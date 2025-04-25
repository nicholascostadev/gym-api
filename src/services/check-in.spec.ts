import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInService } from "./check-in";

describe("Check In Service", () => {
	let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
	let sut: CheckInService;

	beforeEach(() => {
		inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
		sut = new CheckInService(inMemoryCheckInsRepository);

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to check in", async () => {
		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in twice in the same date", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
		});

		await expect(
			sut.execute({
				gymId: "gym-01",
				userId: "user-01",
			}),
		).rejects.toBeInstanceOf(Error);
		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in twice but in different dates", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
		});

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});
});
