const fs = require('fs');
const redisInit = require('./storage/redis');
const mongodbInit = require('./storage/mongodb');
const filesystemInit = require('./storage/filesystem');
const dynamodbInit = require('./storage/dynamodb');
const server = require('./server');
const credentials = require('./credentials');

const { 
    HOME,
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_NAME,
    DATABASE_COLLECTION,
    STORAGE,
    HOST, 
    PORT,
    CA_CERT_PATH,
    KEY_PATH,
    CERT_PATH,
    IGNORE_CLIENT_CERT,
    AWS_REGION,
    DYNAMODB_ENDPOINT,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    DATABASE_TABLENAME,
    DYNAMODB_CAPACITY_READ,
    DYNAMODB_CAPACITY_WRITE
} = process.env;

const loadFile = path => path && fs.readFileSync(path, 'utf8');

const initer = new Map([
    ['mongodb', () => mongodbInit.init( DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_COLLECTION )],
    ['redis', () => redisInit.init({ host: DATABASE_HOST, port: DATABASE_PORT })],
    ['dynamodb', () => dynamodbInit.init( AWS_REGION, DYNAMODB_ENDPOINT, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, DATABASE_TABLENAME, DYNAMODB_CAPACITY_READ, DYNAMODB_CAPACITY_WRITE )],
    ['filesystem', () => filesystemInit.init( HOME + '/.storage')]
]);

const launch = async () => {
    const storage = await initer.get(STORAGE)();
    server.init( 
        storage,
        credentials,
        './keys.proto', 
        `${HOST}:${PORT }`,
        loadFile(CA_CERT_PATH),
        loadFile(KEY_PATH),
        loadFile(CERT_PATH),
        !IGNORE_CLIENT_CERT
    );
}

launch();