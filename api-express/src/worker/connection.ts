import { RedisOptions } from "ioredis";
export const connection: RedisOptions = { maxRetriesPerRequest: null, lazyConnect: true };