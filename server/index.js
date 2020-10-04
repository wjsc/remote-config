const redisInit = require('./storage/redis');
const filesystemInit = require('./storage/filesystem');

const storage = process.env.DATABASE_HOST ? 
    redisInit.init({ host: process.env.DATABASE_HOST, port: process.env.DATABASE_PORT })
    : filesystemInit.init( process.env.HOME + '/.storage');

require('./server').init(
    storage, 
    './keys.proto', 
    `${process.env.HOST}:${process.env.PORT }`, 
);