export const backoff = (attempt: number) => Math.min(1000 * 2 ** attempt, 30000);

