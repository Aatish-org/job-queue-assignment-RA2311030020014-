import "dotenv/config";
import { Worker } from "bullmq";
import { processJob, QUEUE_NAME } from "./processor";
import { connection } from "./queue";

const worker = new Worker(QUEUE_NAME, processJob, { connection, concurrency: 5 });

worker.on("ready", () => console.log("👷 Worker ready"));
worker.on("active", (job) => console.log("⚙️  Job active:", job.id));
worker.on("completed", (job) => console.log("✅ Worker completed event:", job.id));
worker.on("failed", (job, err) => console.log("❌ Worker failed event:", job?.id, err.message));
worker.on("error", (err) => console.error("worker error:", err));
