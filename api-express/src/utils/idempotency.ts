export const idempotencyKey = (req: any) => req.headers['idempotency-key'] || null;

