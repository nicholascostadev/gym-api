import type { GymsRepository } from "@/repositories/gyms-repository";
import type { Gym } from "@prisma/client";

type CreateGymSeviceRequest = {
	title: string;
	description: string | null;
	phone: string | null;
	latitude: number;
	longitude: number;
};

interface CreateGymSeviceResponse {
	gym: Gym;
}

export class CreateGymSevice {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		title,
		description,
		phone,
		latitude,
		longitude,
	}: CreateGymSeviceRequest): Promise<CreateGymSeviceResponse> {
		const gym = await this.gymsRepository.create({
			title,
			description,
			phone,
			latitude,
			longitude,
		});

		return { gym };
	}
}
