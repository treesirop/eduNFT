import { createClient, RedisClientOptions } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

const redisOptions: RedisClientOptions = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
};

const redisClient = createClient(redisOptions);

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redisClient;
