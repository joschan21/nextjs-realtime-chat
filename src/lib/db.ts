import { Redis, RedisConfigNodejs } from "@upstash/redis";

const config: RedisConfigNodejs = {
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL as string,
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN as string,
};
export const db = new Redis(config);
