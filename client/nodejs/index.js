const security = require('./security');
const client = require('./client');
const credentials = require('./credentials');
const clientProxy = require('./clientProxy');

module.exports = {
    init: client.init(
        security, 
        credentials,
        clientProxy, 
        __dirname + '/keys.proto'
    ),
    security
}