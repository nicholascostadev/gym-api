import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CreateGymSevice } from "../create-gym";

export function makeCreateGymService() {
	const gymsRepository = new PrismaGymsRepository();
	const createGymService = new CreateGymSevice(gymsRepository);

	return createGymService;
}
