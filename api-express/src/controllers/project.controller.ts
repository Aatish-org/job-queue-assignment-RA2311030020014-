import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { pool } from "../db/pool";

export async function createProject(req: Request, res: Response) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "name required" });
    if (!req.user?.userId) return res.status(401).json({ message: "unauthorized" });

    const id = uuid();
    await pool.query(
      "INSERT INTO projects (id, name, owner_id) VALUES ($1,$2,$3)",
      [id, name, req.user.userId]
    );

    return res.status(201).json({ id, name, ownerId: req.user.userId });
  } catch (e) {
    return res.status(500).json({ message: "create project failed", error: String(e) });
  }
}

export async function listProjects(req: Request, res: Response) {
  try {
    if (!req.user?.userId) return res.status(401).json({ message: "unauthorized" });

    const r = await pool.query(
      "SELECT id, name, owner_id, created_at FROM projects WHERE owner_id=$1 ORDER BY created_at DESC",
      [req.user.userId]
    );
    return res.json(r.rows);
  } catch (e) {
    return res.status(500).json({ message: "list projects failed", error: String(e) });
  }
}