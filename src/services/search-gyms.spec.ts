import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { SearchGymSevice } from "./search-gyms";

describe("Search Gyms Service", () => {
	let gymsRepository: InMemoryGymsRepository;
	let sut: SearchGymSevice;

	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new SearchGymSevice(gymsRepository);
	});

	it("should be able to search for gyms", async () => {
		await gymsRepository.create({
			title: "TS Gym",
			latitude: 51.9478114,
			longitude: -10.2312044,
		});
		await gymsRepository.create({
			title: "JS Gym",
			latitude: 50.9478114,
			longitude: -10.2312044,
		});

		const { gyms } = await sut.execute({
			query: "TS",
			page: 1,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([expect.objectContaining({ title: "TS Gym" })]);
	});

	it("should be able to fetch paginated gyms search", async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `TS Gym ${i}`,
				latitude: 51.9478114,
				longitude: -10.2312044,
			});
		}

		const { gyms } = await sut.execute({
			query: "TS",
			page: 2,
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: "TS Gym 21" }),
			expect.objectContaining({ title: "TS Gym 22" }),
		]);
	});
});
