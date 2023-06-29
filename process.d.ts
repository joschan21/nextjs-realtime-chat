declare namespace NodeJS {
    export interface ProcessEnv {
        NEXTAUTH_SECRET: string
        NEXTAUTH_URL: string
        UPSTASH_REDIS_REST_URL: string
        UPSTASH_REDIS_REST_TOKEN: string
        GOOGLE_CLIENT_ID: string
        GOOGLE_CLIENT_SECRET: string
        PUSHER_APP_ID: string
        NEXT_PUBLIC_PUSHER_APP_KEY: string
        PUSHER_APP_SECRET: string
        PUSHER_APP_CLUSTER: string
        MONGODB_URI: string
        NEXT_PUBLIC_HUB_HOST_NAME: string
    }
}
