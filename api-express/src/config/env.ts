import dotenv from 'dotenv';
import path from 'path';

// load .env - dotenv/config is also loaded in server.ts but double-load is safe
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const required = ['PORT', 'DATABASE_URL', 'JWT_SECRET', 'REDIS_URL'] as const;

type RequiredEnv = typeof required[number];

const missing: string[] = [];
for (const key of required) {
  if (!process.env[key]) missing.push(key);
}

if (missing.length > 0) {
  // Do not crash during tests if env intentionally missing; still throw to follow requirement
  throw new Error(`Missing required env vars: ${missing.join(', ')}`);
}

export const config = {
  PORT: Number(process.env.PORT) || 4000,
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  REDIS_URL: process.env.REDIS_URL as string,
};

