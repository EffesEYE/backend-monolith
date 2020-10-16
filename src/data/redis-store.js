import IORedis from 'ioredis';

const Redis = new IORedis(`${process.env.REDISEndpoint}`);
export default Redis;
