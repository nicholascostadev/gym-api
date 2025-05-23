import { prisma } from "@/lib/prisma";
import type { Gym, Prisma } from "@prisma/client";
import type { FindManyNearbyParams, GymsRepository } from "../gyms-repository";

export class PrismaGymsRepository implements GymsRepository {
	async findById(id: string): Promise<Gym | null> {
		const gym = await prisma.gym.findUnique({
			where: { id },
		});

		return gym;
	}

	async create(data: Prisma.GymCreateInput): Promise<Gym> {
		const gym = await prisma.gym.create({
			data,
		});

		return gym;
	}

	async searchMany(query: string, page: number): Promise<Gym[]> {
		const gyms = await prisma.gym.findMany({
			where: {
				title: {
					contains: query,
					mode: "insensitive",
				},
			},
			skip: (page - 1) * 20,
			take: 20,
		});

		return gyms;
	}

	async findManyNearby({
		latitude,
		longitude,
	}: FindManyNearbyParams): Promise<Gym[]> {
		const gyms = await prisma.$queryRaw<Gym[]>`
			SELECT * from gyms
			WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
		`;

		return gyms;
	}
}
