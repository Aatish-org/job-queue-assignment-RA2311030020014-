"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeQueue = exports.pauseQueue = exports.getQueues = exports.createQueue = void 0;
const pool_1 = require("../db/pool");
const uuid_1 = require("uuid");
const createQueue = async (req, res) => {
    const userId = req.user?.userId;
    const { projectId, name, priority = 0, concurrencyLimit = 5, maxRetries = 3, retryStrategy = "EXPONENTIAL", retryBaseDelaySec = 5, } = req.body;
    if (!projectId || !name) {
        return res.status(400).json({ message: "projectId and name are required" });
    }
    try {
        const projectCheck = await pool_1.pool.query("SELECT id FROM projects WHERE id = $1 AND owner_id = $2", [projectId, userId]);
        if (projectCheck.rows.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }
        const id = (0, uuid_1.v4)();
        const result = await pool_1.pool.query(`INSERT INTO queues (id, project_id, name, priority, concurrency_limit, max_retries, retry_strategy, retry_base_delay_sec)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`, [id, projectId, name, priority, concurrencyLimit, maxRetries, retryStrategy, retryBaseDelaySec]);
        return res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createQueue = createQueue;
const getQueues = async (req, res) => {
    const userId = req.user?.userId;
    const { projectId } = req.query;
    if (!projectId) {
        return res.status(400).json({ message: "projectId query param is required" });
    }
    try {
        const projectCheck = await pool_1.pool.query("SELECT id FROM projects WHERE id = $1 AND owner_id = $2", [projectId, userId]);
        if (projectCheck.rows.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }
        const result = await pool_1.pool.query("SELECT * FROM queues WHERE project_id = $1 ORDER BY created_at DESC", [projectId]);
        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getQueues = getQueues;
const pauseQueue = async (req, res) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    try {
        const result = await pool_1.pool.query(`UPDATE queues SET status = 'PAUSED'
       WHERE id = $1 AND project_id IN (SELECT id FROM projects WHERE owner_id = $2)
       RETURNING *`, [id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Queue not found" });
        }
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.pauseQueue = pauseQueue;
const resumeQueue = async (req, res) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    try {
        const result = await pool_1.pool.query(`UPDATE queues SET status = 'ACTIVE'
       WHERE id = $1 AND project_id IN (SELECT id FROM projects WHERE owner_id = $2)
       RETURNING *`, [id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Queue not found" });
        }
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.resumeQueue = resumeQueue;
