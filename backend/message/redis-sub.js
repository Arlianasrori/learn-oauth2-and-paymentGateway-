import { redisClient } from "../cache/redisClient.js";

const listener = (message, channel) => console.log(message, channel);
await redisClient.subscribe('notif-chanel', listener);