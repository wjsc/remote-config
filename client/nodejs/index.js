const security = require('./security');
const client = require('./client');

module.exports = {
    init: client.init(security, __dirname + '/keys.proto'),
    security
}