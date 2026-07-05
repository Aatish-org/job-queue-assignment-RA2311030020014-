import "dotenv/config";
import { Queue } from "bullmq";
import IORedis from "ioredis";

export const QUEUE_NAME = "job-queue";

export const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
});

export const bullQueue = new Queue(QUEUE_NAME, { connection });
