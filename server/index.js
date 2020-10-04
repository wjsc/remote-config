const redisInit = require('./storage/redis');
const mongodbInit = require('./storage/mongodb');
const filesystemInit = require('./storage/filesystem');
const server = require('./server');

const initer = new Map([
    ['mongodb', () => mongodbInit.init( process.env.DATABASE_HOST, process.env.DATABASE_PORT, process.env.DATABASE_NAME, process.env.DATABASE_COLLECTION )],
    ['redis', () => redisInit.init({ host: process.env.DATABASE_HOST, port: process.env.DATABASE_PORT })],
    ['filesystem', () => filesystemInit.init( process.env.HOME + '/.storage')]
]);

const launch = async () => {
    const storage = await initer.get(process.env.STORAGE)();
    server.init( storage, './keys.proto', `${process.env.HOST}:${process.env.PORT }`);
}

launch();