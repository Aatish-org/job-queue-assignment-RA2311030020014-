import { Router } from "express";
import authRoutes from "./auth.routes";
import projectRoutes from "./project.routes";
import queueRoutes from "./queue.routes";
import jobRoutes from "./job.routes";
import metricsRoutes from "./metrics.routes";

const router = Router();

router.get("/health", (_req, res) => res.json({ ok: true }));
router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/queues", queueRoutes);
router.use("/jobs", jobRoutes);
router.use("/metrics", metricsRoutes);

export default router;
