import IORedis from 'ioredis';
import { config } from './env';

export const redis = new IORedis(config.REDIS_URL);

redis.on('error', (err) => {
  console.error('Redis error', err);
});

export default redis;

