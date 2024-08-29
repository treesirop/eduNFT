import { createClient, RedisClientOptions } from 'redis';

const redisOptions: RedisClientOptions = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
};

const redisPubSubClient = createClient(redisOptions);

redisPubSubClient.on('error', (err) => {
  console.error('Redis Pub/Sub error:', err);
});

export default redisPubSubClient;
