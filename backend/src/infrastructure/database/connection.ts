import Database, { Database as DatabaseType } from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, "../../../data/tasks.sqlite");

const db: DatabaseType = new Database(dbPath);

// Create tasks table if it doesn't exist
db.exec(`
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

export default db;