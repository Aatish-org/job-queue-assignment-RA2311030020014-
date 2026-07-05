"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fs_1 = require("fs");
const path_1 = require("path");
const pool_1 = require("./pool");
async function runMigration() {
    try {
        const sqlPath = (0, path_1.join)(process.cwd(), "src", "sql", "schema.sql");
        const sql = (0, fs_1.readFileSync)(sqlPath, "utf8");
        await pool_1.pool.query(sql);
        console.log("✅ Migration applied");
    }
    catch (err) {
        console.error("❌ Migration failed:", err);
    }
    finally {
        await pool_1.pool.end();
    }
}
runMigration();
