import { randomUUID } from "node:crypto";
import "dotenv/config";
import { execSync } from "node:child_process";
import { prisma } from "@/lib/prisma";
import type { Environment } from "vitest/environments";

function generateDatabaseURL(schema: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error("Please provide a DATABASE_URL env variable");
	}

	const url = new URL(process.env.DATABASE_URL);

	url.searchParams.set("schema", schema);

	console.log(url.toString());

	return url.toString();
}

export default (<Environment>{
	name: "prisma",
	transformMode: "ssr",
	async setup() {
		const schema = randomUUID();
		const databaseURL = generateDatabaseURL(schema);

		process.env.DATABASE_URL = databaseURL;

		execSync("npx prisma migrate deploy");

		return {
			async teardown() {
				await prisma.$executeRawUnsafe(
					`DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
				);

				await prisma.$disconnect();
			},
		};
	},
});
