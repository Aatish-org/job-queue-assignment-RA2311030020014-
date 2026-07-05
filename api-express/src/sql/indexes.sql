-- Useful indexes

CREATE INDEX IF NOT EXISTS idx_jobs_queue_status ON jobs(queue_id, status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_executions_job_id ON executions(job_id);

