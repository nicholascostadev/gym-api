import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { GymsRepository } from "@/repositories/gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import type { CheckIn } from "@prisma/client";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface ValidateCheckInRequest {
	checkInId: string;
}

interface ValidateCheckInResponse {
	checkIn: CheckIn;
}

export class ValidateCheckInService {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		checkInId,
	}: ValidateCheckInRequest): Promise<ValidateCheckInResponse> {
		const checkIn = await this.checkInsRepository.findById(checkInId);

		if (!checkIn) {
			throw new ResourceNotFoundError();
		}

		const MAX_VALIDATION_TIME_IN_MINUTES = 20;

		const differenceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
			checkIn.created_at,
			"minutes",
		);

		if (
			differenceInMinutesFromCheckInCreation > MAX_VALIDATION_TIME_IN_MINUTES
		) {
			throw new LateCheckInValidationError();
		}

		checkIn.validated_at = new Date();
		await this.checkInsRepository.save(checkIn);

		return {
			checkIn,
		};
	}
}
