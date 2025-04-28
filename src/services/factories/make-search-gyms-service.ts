import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { SearchGymsSevice } from "../search-gyms";

export function makeSearchGymsService() {
	const gymsRepository = new PrismaGymsRepository();
	const searchGymsService = new SearchGymsSevice(gymsRepository);

	return searchGymsService;
}
