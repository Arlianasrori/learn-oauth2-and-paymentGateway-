import { createClient } from 'redis';

export const redisClient = await createClient({
    url :"rediss://default:b0923069c4c04e19bdf72f3b65a8f98d@apn1-above-mayfly-34281.upstash.io:34281"
})
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

