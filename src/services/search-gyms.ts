import type { GymsRepository } from "@/repositories/gyms-repository";
import type { Gym } from "@prisma/client";

type SearchGymSeviceRequest = {
	query: string;
	page: number;
};

interface SearchGymSeviceResponse {
	gyms: Gym[];
}

export class SearchGymSevice {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		query,
		page,
	}: SearchGymSeviceRequest): Promise<SearchGymSeviceResponse> {
		const gyms = await this.gymsRepository.searchMany(query, page);

		return { gyms };
	}
}
