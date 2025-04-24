import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { GetUserProfileService } from "./get-user-profile";

describe("Get User Profile Service", () => {
	let inMemoryUsersRepository: InMemoryUsersRepository;
	let sut: GetUserProfileService;

	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileService(inMemoryUsersRepository);
	});

	it("should be able to get user profile", async () => {
		const createdUser = await inMemoryUsersRepository.create({
			name: "John Doe",
			email: "john.doe@example.com",
			password_hash: await hash("123456", 6),
		});

		const { user } = await sut.execute({
			userId: createdUser.id,
		});

		expect(user.name).toEqual("John Doe");
	});

	it("should not be able to get user profile with a non-existing user id", async () => {
		await expect(
			sut.execute({
				userId: "non-existing-user-id",
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
