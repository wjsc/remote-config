const redisInit = require('./database/redis');
const filesystemInit = require('./database/filesystem');

const database = process.env.DATABASE_HOST ? 
    redisInit.init({ host: process.env.DATABASE_HOST, port: process.env.DATABASE_PORT })
    : filesystemInit.init( process.env.HOME + '/.storage');

require('./server').init(
    database, 
    './keys.proto', 
    `${process.env.HOST}:${process.env.PORT }`, 
);