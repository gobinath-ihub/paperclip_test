import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import 'dotenv/config';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

export default prisma;
