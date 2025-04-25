import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { CheckInService } from "./check-in";

describe("Authenticate Service", () => {
	let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
	let sut: CheckInService;

	beforeEach(() => {
		inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
		sut = new CheckInService(inMemoryCheckInsRepository);
	});

	it("should be able to check in", async () => {
		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});
});
