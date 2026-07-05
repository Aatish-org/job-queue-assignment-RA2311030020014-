"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProjects = exports.createProject = void 0;
const uuid_1 = require("uuid");
const pool_1 = require("../db/pool");
async function createProject(req, res) {
    try {
        const { name } = req.body;
        if (!name)
            return res.status(400).json({ message: "name required" });
        if (!req.user?.userId)
            return res.status(401).json({ message: "unauthorized" });
        const id = (0, uuid_1.v4)();
        await pool_1.pool.query("INSERT INTO projects (id, name, owner_id) VALUES ($1,$2,$3)", [id, name, req.user.userId]);
        return res.status(201).json({ id, name, ownerId: req.user.userId });
    }
    catch (e) {
        return res.status(500).json({ message: "create project failed", error: String(e) });
    }
}
exports.createProject = createProject;
async function listProjects(req, res) {
    try {
        if (!req.user?.userId)
            return res.status(401).json({ message: "unauthorized" });
        const r = await pool_1.pool.query("SELECT id, name, owner_id, created_at FROM projects WHERE owner_id=$1 ORDER BY created_at DESC", [req.user.userId]);
        return res.json(r.rows);
    }
    catch (e) {
        return res.status(500).json({ message: "list projects failed", error: String(e) });
    }
}
exports.listProjects = listProjects;
