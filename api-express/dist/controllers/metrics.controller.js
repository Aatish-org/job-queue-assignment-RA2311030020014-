"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metrics = void 0;
const metrics_service_1 = require("../services/metrics.service");
const metrics = async (_req, res) => {
    try {
        const data = await metrics_service_1.metricsService.getMetrics();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.metrics = metrics;
