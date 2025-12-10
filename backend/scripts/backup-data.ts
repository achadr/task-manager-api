import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";
import fs from "fs";

// Use the same path as connection.ts (relative to backend root when compiled)
const dbPath = path.resolve(__dirname, "../data/tasks.sqlite");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function backupData() {
  try {
    console.log("📦 Backing up existing tasks...");

    const tasks = await prisma.task.findMany();

    const backupPath = path.resolve(__dirname, "../data/tasks-backup.json");
    fs.writeFileSync(backupPath, JSON.stringify(tasks, null, 2));

    console.log(`✅ Backed up ${tasks.length} tasks to: ${backupPath}`);
    console.log("\nBackup complete! You can now run the migration.");

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Backup failed:", error);
    process.exit(1);
  }
}

backupData();
