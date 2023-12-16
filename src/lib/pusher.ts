import PusherServer from "pusher";
import PusherClient from "pusher-js";

const config = {
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
  secret: process.env.NEXT_PUBLIC_PUSHER_APP_SECRET as string,
  cluster: "eu",
  useTLS: Boolean(process.env.NEXT_PUBLIC_PUSHER_APP_TLS!),
};
export const pusherServer = new PusherServer({ ...config });

export const pusherClient = new PusherClient(config.key, {
  cluster: "eu",
});
