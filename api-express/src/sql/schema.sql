CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS queues (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  priority INT NOT NULL DEFAULT 0,
  concurrency_limit INT NOT NULL DEFAULT 5,
  max_retries INT NOT NULL DEFAULT 3,
  retry_strategy TEXT NOT NULL DEFAULT 'EXPONENTIAL',
  retry_base_delay_sec INT NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, name)
);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  queue_id TEXT NOT NULL REFERENCES queues(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'QUEUED',
  payload JSONB NOT NULL,
  priority INT NOT NULL DEFAULT 0,
  scheduled_at TIMESTAMPTZ,
  available_at TIMESTAMPTZ DEFAULT NOW(),
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 3,
  idempotency_key TEXT,
  claimed_by_worker_id TEXT,
  claimed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(queue_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS workers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  last_heartbeat TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_executions (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id TEXT REFERENCES workers(id) ON DELETE SET NULL,
  attempt INT NOT NULL,
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  duration_ms INT,
  error_message TEXT,
  log TEXT
);

CREATE TABLE IF NOT EXISTS dead_letter_queue (
  id TEXT PRIMARY KEY,
  job_id TEXT UNIQUE NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  queue_id TEXT NOT NULL REFERENCES queues(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  attempts INT NOT NULL,
  last_error TEXT,
  payload JSONB NOT NULL,
  failed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_claim ON jobs(queue_id, status, priority DESC, available_at ASC);
CREATE INDEX IF NOT EXISTS idx_jobs_status_available ON jobs(status, available_at);
CREATE INDEX IF NOT EXISTS idx_workers_heartbeat ON workers(last_heartbeat);