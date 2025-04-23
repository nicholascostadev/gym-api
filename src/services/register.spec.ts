import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { compare } from "bcryptjs";
import { describe, expect, it } from "vitest";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { RegisterService } from "./register";

describe("Register Service", () => {
	it("should hash user password upon registration", async () => {
		const inMemoryUsersRepository = new InMemoryUsersRepository();
		const registerService = new RegisterService(inMemoryUsersRepository);

		const { user } = await registerService.execute({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "123456",
		});

		const isPasswordCorrectlyHashed = await compare(
			"123456",
			user.password_hash,
		);

		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it("should not be able to register with same email twice", async () => {
		const inMemoryUsersRepository = new InMemoryUsersRepository();
		const registerService = new RegisterService(inMemoryUsersRepository);

		const email = "john.doe@example.com";

		await registerService.execute({
			name: "John Doe",
			email,
			password: "123456",
		});

		await expect(
			registerService.execute({
				name: "John Doe",
				email,
				password: "123456",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});

	it("should be able to register", async () => {
		const inMemoryUsersRepository = new InMemoryUsersRepository();
		const registerService = new RegisterService(inMemoryUsersRepository);

		const email = "john.doe@example.com";

		const { user } = await registerService.execute({
			name: "John Doe",
			email,
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});
});
