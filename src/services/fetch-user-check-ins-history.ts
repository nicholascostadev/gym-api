import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { CheckIn } from "@prisma/client";

interface FectchUserCheckInsHistoryRequest {
	userId: string;
	page: number;
}

interface FetchUserCheckInsHistoryResponse {
	checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryService {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		userId,
		page,
	}: FectchUserCheckInsHistoryRequest): Promise<FetchUserCheckInsHistoryResponse> {
		const checkIns = await this.checkInsRepository.findManyByUserId(
			userId,
			page,
		);

		return {
			checkIns,
		};
	}
}
