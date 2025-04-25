import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInService } from "./check-in";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

describe("Check In Service", () => {
	let checkInsRepository: InMemoryCheckInsRepository;
	let gymsRepository: InMemoryGymsRepository;
	let sut: CheckInService;

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInService(checkInsRepository, gymsRepository);

		await gymsRepository.create({
			id: "gym-01",
			title: "TS Gym",
			description: "",
			phone: "",
			latitude: 0,
			longitude: 0,
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to check in", async () => {
		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in twice in the same date", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		await expect(
			sut.execute({
				gymId: "gym-01",
				userId: "user-01",
				userLatitude: 0,
				userLongitude: 0,
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in twice but in different dates", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in when too far from gym", async () => {
		gymsRepository.items.push({
			id: "gym-02",
			title: "TS Gym 2",
			description: "",
			phone: "",
			latitude: new Decimal(51.9478114),
			longitude: new Decimal(-10.2312044),
		});

		await expect(
			sut.execute({
				gymId: "gym-02",
				userId: "user-01",
				userLatitude: 53.3244116,
				userLongitude: -6.4105057,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
