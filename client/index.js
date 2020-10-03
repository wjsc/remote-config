const security = require('./security');
const client = require('./client');

module.exports = {
    init: client.init(security, '../keys.proto')
}