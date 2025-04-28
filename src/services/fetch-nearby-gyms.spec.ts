import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchNearbyGymsService } from "./fetch-nearby-gyms";

describe("Fetch Nearby Gyms Service", () => {
	let gymsRepository: InMemoryGymsRepository;
	let sut: FetchNearbyGymsService;

	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new FetchNearbyGymsService(gymsRepository);
	});

	it("should be able to fetch nearby gyms", async () => {
		await gymsRepository.create({
			title: "Near Gym",
			latitude: 51.9478114,
			longitude: -10.2312044,
		});
		await gymsRepository.create({
			title: "Far Gym",
			latitude: 54.9478114,
			longitude: -10.2312044,
		});

		const { gyms } = await sut.execute({
			userLatitude: 51.9478114,
			userLongitude: -10.2312044,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
	});
});
