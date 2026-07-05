import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { pool } from "./pool";

async function runMigration() {
  try {
    const sqlPath = join(process.cwd(), "src", "sql", "schema.sql");
    const sql = readFileSync(sqlPath, "utf8");
    await pool.query(sql);
    console.log("✅ Migration applied");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await pool.end();
  }
}

runMigration();