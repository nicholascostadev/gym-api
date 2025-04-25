import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { CheckIn } from "@prisma/client";

interface CheckInRequest {
	userId: string;
	gymId: string;
}

interface CheckInResponse {
	checkIn: CheckIn;
}

export class CheckInService {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({ userId, gymId }: CheckInRequest): Promise<CheckInResponse> {
		const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
			userId,
			new Date(),
		);

		if (checkInOnSameDate) {
			throw new Error();
		}

		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId,
		});

		return {
			checkIn,
		};
	}
}
