import { Request, Response } from 'express';

export const listWorkers = async (_req: Request, res: Response) => {
  res.json({ workers: [] });
};

