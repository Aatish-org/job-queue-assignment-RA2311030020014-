import { Router } from "express";
import { createQueue, getQueues, pauseQueue, resumeQueue } from "../controllers/queue.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.post("/", requireAuth, requireRole("ADMIN"), createQueue);
router.get("/", requireAuth, requireRole("ADMIN"), getQueues);
router.patch("/:id/pause", requireAuth, requireRole("ADMIN"), pauseQueue);
router.patch("/:id/resume", requireAuth, requireRole("ADMIN"), resumeQueue);

export default router;
