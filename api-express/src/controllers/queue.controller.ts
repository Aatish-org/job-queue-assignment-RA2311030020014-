import { Request, Response } from "express";
import { pool } from "../db/pool";
import { v4 as uuidv4 } from "uuid";

export const createQueue = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const {
    projectId,
    name,
    priority = 0,
    concurrencyLimit = 5,
    maxRetries = 3,
    retryStrategy = "EXPONENTIAL",
    retryBaseDelaySec = 5,
  } = req.body;

  if (!projectId || !name) {
    return res.status(400).json({ message: "projectId and name are required" });
  }

  try {
    const projectCheck = await pool.query(
      "SELECT id FROM projects WHERE id = $1 AND owner_id = $2",
      [projectId, userId]
    );
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO queues (id, project_id, name, priority, concurrency_limit, max_retries, retry_strategy, retry_base_delay_sec)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [id, projectId, name, priority, concurrencyLimit, maxRetries, retryStrategy, retryBaseDelaySec]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getQueues = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { projectId } = req.query;

  if (!projectId) {
    return res.status(400).json({ message: "projectId query param is required" });
  }

  try {
    const projectCheck = await pool.query(
      "SELECT id FROM projects WHERE id = $1 AND owner_id = $2",
      [projectId, userId]
    );
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const result = await pool.query(
      "SELECT * FROM queues WHERE project_id = $1 ORDER BY created_at DESC",
      [projectId]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const pauseQueue = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE queues SET status = 'PAUSED'
       WHERE id = $1 AND project_id IN (SELECT id FROM projects WHERE owner_id = $2)
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Queue not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resumeQueue = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE queues SET status = 'ACTIVE'
       WHERE id = $1 AND project_id IN (SELECT id FROM projects WHERE owner_id = $2)
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Queue not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
