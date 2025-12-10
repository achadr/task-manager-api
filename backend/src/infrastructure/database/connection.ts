import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const dbPath = path.resolve(__dirname, "../../../data/tasks.sqlite");

const adapter = new PrismaLibSql({
  url: `file:${dbPath}`,
});

const prisma = new PrismaClient({
  adapter,
});

// Initialize database table
const initDb = async () => {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      due_date TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
};

initDb().catch(console.error);

export default prisma;