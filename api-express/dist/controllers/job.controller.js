"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelJob = exports.getJobById = exports.getJobs = exports.createJob = void 0;
const pool_1 = require("../db/pool");
const uuid_1 = require("uuid");
const queue_1 = require("../worker/queue");
const createJob = async (req, res) => {
    const userId = req.user?.userId;
    const { queueId, type, payload, priority = 0, scheduledAt, maxAttempts = 3, idempotencyKey, } = req.body;
    if (!queueId || !type) {
        return res.status(400).json({ message: "queueId and type are required" });
    }
    try {
        const queueCheck = await pool_1.pool.query(`SELECT q.id FROM queues q
       JOIN projects p ON q.project_id = p.id
       WHERE q.id = $1 AND p.owner_id = $2`, [queueId, userId]);
        if (queueCheck.rows.length === 0) {
            return res.status(404).json({ message: "Queue not found" });
        }
        if (idempotencyKey) {
            const existing = await pool_1.pool.query("SELECT id FROM jobs WHERE queue_id = $1 AND idempotency_key = $2", [queueId, idempotencyKey]);
            if (existing.rows.length > 0) {
                return res.status(409).json({ message: "Duplicate idempotency key for this queue" });
            }
        }
        const id = (0, uuid_1.v4)();
        const availableAt = scheduledAt ? new Date(scheduledAt) : new Date();
        const result = await pool_1.pool.query(`INSERT INTO jobs (id, queue_id, type, payload, priority, status, available_at, attempts, max_attempts, idempotency_key)
       VALUES ($1, $2, $3, $4, $5, 'QUEUED', $6, 0, $7, $8)
       RETURNING *`, [id, queueId, type, payload ?? {}, priority, availableAt, maxAttempts, idempotencyKey ?? null]);
        const created = result.rows[0];
        await queue_1.bullQueue.add("process-job", { jobId: created.id }, { removeOnComplete: true, removeOnFail: true });
        return res.status(201).json(created);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createJob = createJob;
const getJobs = async (req, res) => {
    const userId = req.user?.userId;
    const { queueId, status, limit = "20", offset = "0" } = req.query;
    if (!queueId) {
        return res.status(400).json({ message: "queueId query param is required" });
    }
    const parsedLimit = Math.min(parseInt(limit, 10) || 20, 100);
    const parsedOffset = parseInt(offset, 10) || 0;
    try {
        const queueCheck = await pool_1.pool.query(`SELECT q.id FROM queues q
       JOIN projects p ON q.project_id = p.id
       WHERE q.id = $1 AND p.owner_id = $2`, [queueId, userId]);
        if (queueCheck.rows.length === 0) {
            return res.status(404).json({ message: "Queue not found" });
        }
        let query = "SELECT * FROM jobs WHERE queue_id = $1";
        const params = [queueId];
        if (status) {
            params.push(status);
            query += ` AND status = $${params.length}`;
        }
        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parsedLimit, parsedOffset);
        const result = await pool_1.pool.query(query, params);
        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getJobs = getJobs;
const getJobById = async (req, res) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    try {
        const result = await pool_1.pool.query(`SELECT j.* FROM jobs j
       JOIN queues q ON j.queue_id = q.id
       JOIN projects p ON q.project_id = p.id
       WHERE j.id = $1 AND p.owner_id = $2`, [id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Job not found" });
        }
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getJobById = getJobById;
const cancelJob = async (req, res) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    try {
        const jobCheck = await pool_1.pool.query(`SELECT j.id, j.status FROM jobs j
       JOIN queues q ON j.queue_id = q.id
       JOIN projects p ON q.project_id = p.id
       WHERE j.id = $1 AND p.owner_id = $2`, [id, userId]);
        if (jobCheck.rows.length === 0) {
            return res.status(404).json({ message: "Job not found" });
        }
        const { status } = jobCheck.rows[0];
        if (!["QUEUED", "RETRY_SCHEDULED"].includes(status)) {
            return res.status(409).json({
                message: `Cannot cancel a job with status '${status}'`,
            });
        }
        const result = await pool_1.pool.query(`UPDATE jobs SET status = 'CANCELLED', updated_at = now()
       WHERE id = $1
       RETURNING *`, [id]);
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.cancelJob = cancelJob;
