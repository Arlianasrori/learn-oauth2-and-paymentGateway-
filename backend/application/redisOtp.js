import { createClient } from 'redis';

export const redisOtp = await createClient({
  database : 1
})
  .on('error', err => console.log('Redis Client Error', err))
  .connect();
