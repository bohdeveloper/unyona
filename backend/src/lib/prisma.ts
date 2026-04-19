console.log("DATABASE_URL prisma.ts:", process.env.DATABASE_URL);
console.log("CWD REAL prisma.ts:", process.cwd());

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
