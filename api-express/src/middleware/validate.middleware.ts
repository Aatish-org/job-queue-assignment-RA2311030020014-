import { Request, Response, NextFunction } from 'express';

export const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  // placeholder for validation logic
  next();
};

