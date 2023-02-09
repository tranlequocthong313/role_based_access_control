const { createClient } = require('redis');
const redis = createClient();

redis.on('connect', () => console.log('connected to redis'));
redis.on('error', (error) => console.log(error));

redis.connect().catch(console.error);

module.exports = redis;
