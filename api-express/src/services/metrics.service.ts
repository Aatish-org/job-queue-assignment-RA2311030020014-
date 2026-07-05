import { pool } from "../db/pool";

export const metricsService = {
  getMetrics: async () => {
    const [queued, running, completed, failed, dlq, workers] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS count FROM jobs WHERE status = 'QUEUED'"),
      pool.query("SELECT COUNT(*)::int AS count FROM jobs WHERE status = 'RUNNING'"),
      pool.query("SELECT COUNT(*)::int AS count FROM jobs WHERE status = 'COMPLETED'"),
      pool.query("SELECT COUNT(*)::int AS count FROM jobs WHERE status = 'FAILED'"),
      pool.query("SELECT COUNT(*)::int AS count FROM dead_letter_queue"),
      pool.query("SELECT COUNT(*)::int AS count FROM workers"),
    ]);

    return {
      queued: queued.rows[0].count,
      running: running.rows[0].count,
      completed: completed.rows[0].count,
      failed: failed.rows[0].count,
      dlq: dlq.rows[0].count,
      workers: workers.rows[0].count,
    };
  },
};

