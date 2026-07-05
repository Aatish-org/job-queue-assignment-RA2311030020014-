import { Request, Response } from "express";
import { metricsService } from "../services/metrics.service";

export const metrics = async (_req: Request, res: Response) => {
  try {
    const data = await metricsService.getMetrics();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

