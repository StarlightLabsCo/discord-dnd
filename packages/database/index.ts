export * from "@prisma/client";

import { PrismaClient } from "@prisma/client";
export const db = new PrismaClient();
