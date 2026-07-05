export type User = {
  id: string;
  email: string;
  name?: string | null;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type Project = {
  id: string;
  name: string;
  owner_id?: string;
  created_at?: string;
};

export type Queue = {
  id: string;
  project_id: string;
  name: string;
  status: string;
  priority: number;
  concurrency_limit: number;
  max_retries: number;
  retry_strategy: string;
  retry_base_delay_sec: number;
  created_at?: string;
};

export type Job = {
  id: string;
  queue_id: string;
  type: string;
  status: string;
  payload?: any;
  priority: number;
  attempts: number;
  max_attempts: number;
  claimed_by_worker_id?: string | null;
  claimed_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  failed_at?: string | null;
  last_error?: string | null;
  created_at?: string;
};

export type Worker = {
  id: string;
  name?: string;
  status?: string;
  last_heartbeat?: string;
  started_at?: string;
};
