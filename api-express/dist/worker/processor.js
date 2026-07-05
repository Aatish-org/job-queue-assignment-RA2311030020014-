"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUEUE_NAME = exports.processJob = void 0;
require("dotenv/config");
const pool_1 = require("../db/pool");
const uuid_1 = require("uuid");
const execution_repo_1 = require("../repositories/execution.repo");
const queue_1 = require("./queue");
Object.defineProperty(exports, "QUEUE_NAME", { enumerable: true, get: function () { return queue_1.QUEUE_NAME; } });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const processJob = async (bullJob) => {
    const jobId = bullJob.data?.jobId;
    if (!jobId) {
        throw new Error("Missing jobId in job payload");
    }
    const workerId = "worker-1";
    const startedAt = Date.now();
    const executionId = await execution_repo_1.executionRepo.createExecution({
        jobId,
        workerId,
        attempt: bullJob.attemptsMade + 1,
    });
    await pool_1.pool.query(`UPDATE jobs
     SET status='RUNNING', started_at=NOW(), claimed_by_worker_id=$1, claimed_at=NOW(), updated_at=NOW()
     WHERE id=$2`, [workerId, jobId]);
    try {
        const dbJob = await pool_1.pool.query(`SELECT * FROM jobs WHERE id=$1`, [jobId]);
        if (!dbJob.rowCount) {
            throw new Error("Job not found");
        }
        const row = dbJob.rows[0];
        if (row.type === "EMAIL")
            await sleep(1000);
        else if (row.type === "WEBHOOK")
            await sleep(1200);
        else
            await sleep(800);
        if (row.payload?.fail === true) {
            throw new Error("Forced failure from payload.fail=true");
        }
        await pool_1.pool.query(`UPDATE jobs
       SET status='COMPLETED', completed_at=NOW(), updated_at=NOW()
       WHERE id=$1`, [jobId]);
        await execution_repo_1.executionRepo.completeExecution({
            executionId,
            durationMs: Date.now() - startedAt,
        });
        console.log(`✅ Job completed: ${jobId}`);
        return { ok: true };
    }
    catch (err) {
        const failureMessage = String(err?.message || err);
        const result = await pool_1.pool.query(`UPDATE jobs
       SET attempts=attempts+1, last_error=$2, failed_at=NOW(), updated_at=NOW()
       WHERE id=$1
       RETURNING id, queue_id, attempts, max_attempts, payload, last_error`, [jobId, failureMessage]);
        const jobRow = result.rows[0];
        if (!jobRow) {
            throw err;
        }
        await execution_repo_1.executionRepo.failExecution({
            executionId,
            durationMs: Date.now() - startedAt,
            errorMessage: failureMessage,
        });
        if (jobRow.attempts < jobRow.max_attempts) {
            await pool_1.pool.query(`UPDATE jobs
         SET status='QUEUED', available_at=NOW() + INTERVAL '10 seconds', updated_at=NOW()
         WHERE id=$1`, [jobId]);
            await queue_1.bullQueue.add("process-job", { jobId }, { delay: 10000, removeOnComplete: true, removeOnFail: true });
            console.log(`🔁 Job retried: ${jobId} (attempt ${jobRow.attempts}/${jobRow.max_attempts})`);
        }
        else {
            await pool_1.pool.query(`UPDATE jobs SET status='FAILED', updated_at=NOW() WHERE id=$1`, [jobId]);
            await pool_1.pool.query(`INSERT INTO dead_letter_queue (id, job_id, queue_id, reason, attempts, last_error, payload)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (job_id) DO NOTHING`, [(0, uuid_1.v4)(), jobId, jobRow.queue_id, "MAX_RETRIES_EXCEEDED", jobRow.attempts, jobRow.last_error, jobRow.payload]);
            console.log(`💀 Job moved to DLQ: ${jobId}`);
        }
        throw err;
    }
};
exports.processJob = processJob;
