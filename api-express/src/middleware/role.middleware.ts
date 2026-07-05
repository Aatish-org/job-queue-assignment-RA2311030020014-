import { Request, Response, NextFunction } from "express";

export type UserRole = "ADMIN" | "USER";

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role as UserRole | undefined;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "forbidden" });
    }

    next();
  };
}
