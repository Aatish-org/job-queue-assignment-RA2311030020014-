"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsService = void 0;
const pool_1 = require("../db/pool");
exports.metricsService = {
    getMetrics: async () => {
        const [queued, running, completed, failed, dlq, workers] = await Promise.all([
            pool_1.pool.query("SELECT COUNT(*)::int AS count FROM jobs WHERE status = 'QUEUED'"),
            pool_1.pool.query("SELECT COUNT(*)::int AS count FROM jobs WHERE status = 'RUNNING'"),
            pool_1.pool.query("SELECT COUNT(*)::int AS count FROM jobs WHERE status = 'COMPLETED'"),
            pool_1.pool.query("SELECT COUNT(*)::int AS count FROM jobs WHERE status = 'FAILED'"),
            pool_1.pool.query("SELECT COUNT(*)::int AS count FROM dead_letter_queue"),
            pool_1.pool.query("SELECT COUNT(*)::int AS count FROM workers"),
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
