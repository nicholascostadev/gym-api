import type { GymsRepository } from "@/repositories/gyms-repository";
import type { Gym } from "@prisma/client";

type SearchGymsSeviceRequest = {
	query: string;
	page: number;
};

interface SearchGymsSeviceResponse {
	gyms: Gym[];
}

export class SearchGymsSevice {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		query,
		page,
	}: SearchGymsSeviceRequest): Promise<SearchGymsSeviceResponse> {
		const gyms = await this.gymsRepository.searchMany(query, page);

		return { gyms };
	}
}
