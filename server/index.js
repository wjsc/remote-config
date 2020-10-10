const redisInit = require('./storage/redis');
const mongodbInit = require('./storage/mongodb');
const filesystemInit = require('./storage/filesystem');
const server = require('./server');

const { 
    HOME,
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_NAME,
    DATABASE_COLLECTION,
    STORAGE,
    HOST, 
    PORT
} = process.env;

const initer = new Map([
    ['mongodb', () => mongodbInit.init( DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_COLLECTION )],
    ['redis', () => redisInit.init({ host: DATABASE_HOST, port: DATABASE_PORT })],
    ['filesystem', () => filesystemInit.init( HOME + '/.storage')]
]);

const launch = async () => {
    const storage = await initer.get(STORAGE)();
    server.init( 
        storage, 
        './keys.proto', 
        `${HOST}:${PORT }`
    );
}

launch();