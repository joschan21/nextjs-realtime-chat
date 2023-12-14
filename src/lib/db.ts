import { Redis,RedisConfigNodejs } from '@upstash/redis'

const config:RedisConfigNodejs = {
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
}
export const db = new Redis(
  config
)
