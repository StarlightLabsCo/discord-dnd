import { PrismaClient } from "@prisma/client";
export const db = new PrismaClient();

export * from "@prisma/client";
export { UserSchema } from "./prisma/generated/zod";
