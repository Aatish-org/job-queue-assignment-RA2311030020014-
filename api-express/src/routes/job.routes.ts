import { Router } from "express";
import { createJob, getJobs, getJobById, cancelJob } from "../controllers/job.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/", requireAuth, createJob);
router.get("/", requireAuth, getJobs);
router.get("/:id", requireAuth, getJobById);
router.patch("/:id/cancel", requireAuth, cancelJob);

export default router;
