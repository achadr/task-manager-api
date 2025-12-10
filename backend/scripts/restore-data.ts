import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";
import fs from "fs";

// Use the same path as connection.ts (relative to backend root when compiled)
const dbPath = path.resolve(__dirname, "../data/tasks.sqlite");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function restoreData() {
  try {
    const backupPath = path.resolve(__dirname, "../data/tasks-backup.json");

    if (!fs.existsSync(backupPath)) {
      console.log("❌ No backup file found at:", backupPath);
      process.exit(1);
    }

    console.log("📥 Restoring tasks from backup...");

    const tasks = JSON.parse(fs.readFileSync(backupPath, "utf-8"));

    for (const task of tasks) {
      await prisma.task.create({
        data: {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        },
      });
    }

    console.log(`✅ Restored ${tasks.length} tasks successfully!`);

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Restore failed:", error);
    process.exit(1);
  }
}

restoreData();
