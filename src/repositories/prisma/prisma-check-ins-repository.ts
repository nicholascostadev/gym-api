import { prisma } from "@/lib/prisma";
import type { CheckIn, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import type { CheckInsRepository } from "../check-ins-repository";

export class PrismaCheckInsRepository implements CheckInsRepository {
	async findByUserIdOnDate(
		userId: string,
		date: Date,
	): Promise<CheckIn | null> {
		const startOfTheDay = dayjs(date).startOf("day").toDate();
		const endOfTheDay = dayjs(date).endOf("day").toDate();

		const checkIn = await prisma.checkIn.findFirst({
			where: {
				user_id: userId,
				created_at: {
					gte: startOfTheDay,
					lt: endOfTheDay,
				},
			},
		});

		return checkIn;
	}
	async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
		const checkIns = await prisma.checkIn.findMany({
			where: { user_id: userId },
			skip: (page - 1) * 20,
			take: 20,
		});

		return checkIns;
	}
	async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
		const checkIn = await prisma.checkIn.create({
			data,
		});

		return checkIn;
	}

	async countByUserId(userId: string): Promise<number> {
		const count = await prisma.checkIn.count({
			where: { user_id: userId },
		});

		return count;
	}

	async findById(id: string): Promise<CheckIn | null> {
		const checkIn = await prisma.checkIn.findUnique({
			where: { id },
		});

		return checkIn;
	}

	async save(data: CheckIn): Promise<CheckIn> {
		const checkIn = await prisma.checkIn.update({
			where: { id: data.id },
			data,
		});

		return checkIn;
	}
}
