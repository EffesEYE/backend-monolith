import IORedis from 'ioredis';

const Redis = new IORedis(`${process.env.REDIS_ENDPOINT}`);
export default Redis;
