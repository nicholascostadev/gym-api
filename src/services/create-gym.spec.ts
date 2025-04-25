import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateGymSevice } from "./create-gym";

describe("Create Gym Service", () => {
	let gymsRepository: InMemoryGymsRepository;
	let sut: CreateGymSevice;

	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new CreateGymSevice(gymsRepository);
	});

	it("should be able to register", async () => {
		const { gym } = await sut.execute({
			title: "TS Gym",
			description: null,
			phone: null,
			latitude: 51.9478114,
			longitude: -10.2312044,
		});

		expect(gym.id).toEqual(expect.any(String));
	});
});
