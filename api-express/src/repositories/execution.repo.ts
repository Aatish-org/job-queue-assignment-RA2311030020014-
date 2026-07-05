import { pool } from "../db/pool";
import { v4 as uuid } from "uuid";

type CreateExecutionInput = {
  jobId: string;
  workerId: string;
  attempt: number;
};

type CompleteExecutionInput = {
  executionId: string;
  durationMs: number;
};

type FailExecutionInput = {
  executionId: string;
  durationMs: number;
  errorMessage: string;
};

export const executionRepo = {
  createExecution: async ({ jobId, workerId, attempt }: CreateExecutionInput) => {
    const executionId = uuid();

    await pool.query(
      `INSERT INTO job_executions (id, job_id, worker_id, attempt, status, started_at, finished_at, duration_ms, error_message, log)
       VALUES ($1, $2, $3, $4, 'RUNNING', NOW(), NULL, NULL, NULL, 'started')`,
      [executionId, jobId, workerId, attempt]
    );

    return executionId;
  },

  completeExecution: async ({ executionId, durationMs }: CompleteExecutionInput) => {
    await pool.query(
      `UPDATE job_executions
       SET status='SUCCEEDED', finished_at=NOW(), duration_ms=$2, log='succeeded'
       WHERE id=$1`,
      [executionId, durationMs]
    );
  },

  failExecution: async ({ executionId, durationMs, errorMessage }: FailExecutionInput) => {
    await pool.query(
      `UPDATE job_executions
       SET status='FAILED', finished_at=NOW(), duration_ms=$2, error_message=$3, log='failed'
       WHERE id=$1`,
      [executionId, durationMs, errorMessage]
    );
  },
};

