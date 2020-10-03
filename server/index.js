const database = require('./database').init({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
});
require('./server').init(
    database, 
    '../keys.proto', 
    `${process.env.HOST}:${process.env.PORT }`, 
);