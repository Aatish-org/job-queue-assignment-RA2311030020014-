import { Router } from "express";
import { createProject, listProjects } from "../controllers/project.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.post("/", requireAuth, requireRole("ADMIN"), createProject);
router.get("/", requireAuth, requireRole("ADMIN"), listProjects);

export default router;