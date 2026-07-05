"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// load .env - dotenv/config is also loaded in server.ts but double-load is safe
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const required = ['PORT', 'DATABASE_URL', 'JWT_SECRET', 'REDIS_URL'];
const missing = [];
for (const key of required) {
    if (!process.env[key])
        missing.push(key);
}
if (missing.length > 0) {
    // Do not crash during tests if env intentionally missing; still throw to follow requirement
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
}
exports.config = {
    PORT: Number(process.env.PORT) || 4000,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_URL: process.env.REDIS_URL,
};
