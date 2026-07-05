"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executionRepo = void 0;
const pool_1 = require("../db/pool");
const uuid_1 = require("uuid");
exports.executionRepo = {
    createExecution: async ({ jobId, workerId, attempt }) => {
        const executionId = (0, uuid_1.v4)();
        await pool_1.pool.query(`INSERT INTO job_executions (id, job_id, worker_id, attempt, status, started_at, finished_at, duration_ms, error_message, log)
       VALUES ($1, $2, $3, $4, 'RUNNING', NOW(), NULL, NULL, NULL, 'started')`, [executionId, jobId, workerId, attempt]);
        return executionId;
    },
    completeExecution: async ({ executionId, durationMs }) => {
        await pool_1.pool.query(`UPDATE job_executions
       SET status='SUCCEEDED', finished_at=NOW(), duration_ms=$2, log='succeeded'
       WHERE id=$1`, [executionId, durationMs]);
    },
    failExecution: async ({ executionId, durationMs, errorMessage }) => {
        await pool_1.pool.query(`UPDATE job_executions
       SET status='FAILED', finished_at=NOW(), duration_ms=$2, error_message=$3, log='failed'
       WHERE id=$1`, [executionId, durationMs, errorMessage]);
    },
};
