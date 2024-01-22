import { createClient } from 'redis';

export const redisClient = await createClient({
  database : 0
})
  .on('error', err => console.log('Redis Client Error', err))
  .connect();


