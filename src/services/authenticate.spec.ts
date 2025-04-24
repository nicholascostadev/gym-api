import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateService } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentails-error";

describe("Authenticate Service", () => {
	let inMemoryUsersRepository: InMemoryUsersRepository;
	let sut: AuthenticateService;

	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateService(inMemoryUsersRepository);
	});

	it("should be able to authenticate", async () => {
		await inMemoryUsersRepository.create({
			name: "John Doe",
			email: "john.doe@example.com",
			password_hash: await hash("123456", 6),
		});

		const { user } = await sut.execute({
			email: "john.doe@example.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("should not be able to authenticate with an email that does not exist", async () => {
		await expect(
			sut.execute({
				email: "john.doe@example.com",
				password: "123456",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("should not be able to authenticate with wrong password", async () => {
		await inMemoryUsersRepository.create({
			name: "John Doe",
			email: "john.doe@example.com",
			password_hash: await hash("123456", 6),
		});

		await expect(
			sut.execute({
				email: "john.doe@example.com",
				password: "1234567",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
