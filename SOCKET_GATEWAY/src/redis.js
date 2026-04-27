import { createClient } from "redis";

export const pubClient = createClient({
  url: "redis://127.0.0.1:6379"
});

// 2) adapter subscriber
export const subClient = pubClient.duplicate();

// 3) YOUR OWN redis usage (VERY IMPORTANT)
export const redisClient = createClient({
  url: "redis://127.0.0.1:6379"
});

export const connectRedis = async () => {
  try {
    await pubClient.connect();
    await subClient.connect();
    await redisClient.connect();

    console.log("Redis connected (Socket Gateway)");
  } catch (err) {
    console.log("Redis connection error:", err);
  }
};
