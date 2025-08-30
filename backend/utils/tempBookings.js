import redis from "./redisClient.js";
export const saveTempBooking = async (token, bookingData, ttl = 600) => {
  // ttl = 600 seconds (10 minutes) by default
  await redis.set(`booking:${token}`, JSON.stringify(bookingData), "EX", ttl);
};

export const getTempBooking = async (token) => {
  const data = await redis.get(`booking:${token}`);
  return data ? JSON.parse(data) : null;
};

export const deleteTempBooking = async (token) => {
  await redis.del(`booking:${token}`);
};