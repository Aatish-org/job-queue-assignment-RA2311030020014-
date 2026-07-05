"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const project_routes_1 = __importDefault(require("./project.routes"));
const queue_routes_1 = __importDefault(require("./queue.routes"));
const job_routes_1 = __importDefault(require("./job.routes"));
const metrics_routes_1 = __importDefault(require("./metrics.routes"));
const router = (0, express_1.Router)();
router.get("/health", (_req, res) => res.json({ ok: true }));
router.use("/auth", auth_routes_1.default);
router.use("/projects", project_routes_1.default);
router.use("/queues", queue_routes_1.default);
router.use("/jobs", job_routes_1.default);
router.use("/metrics", metrics_routes_1.default);
exports.default = router;
