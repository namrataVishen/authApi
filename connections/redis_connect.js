const redis = require("redis");
const client = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
});

client.on("error", (err) => {
  console.log(`Redis Connection Failed Error --> ${err}`);
});

client.on("ready", () => {
  console.log(`Redis Ready To Use`);
});

client.on("connect", () => {
  console.log(`Redis Connected Successfully`);
});

client.on("end", () => {
  console.log(`Redis Disconnected`);
});

client.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
