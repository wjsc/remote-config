const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader')

const init = (database, protoPath, ip, port) => {

    const packageDefinition = protoLoader.loadSync(protoPath);
    const proto = grpc.loadPackageDefinition(packageDefinition);
    const server = new grpc.Server()
     
    server.addService(proto.ConfigService.service, {
        get: ({ request: { namespace, key } }, callback) => {
            database.get(namespace, key)
            .then( result => callback(null , result ))
            .catch( callback )
        },
        set: ({ request: { namespace, key, value } }, callback) => {
            database.set(namespace, key, value)
            .then( result => callback(null , result ))
            .catch( callback )
        },
        del: ({ request: { namespace, key } }, callback) => {
            database.del(namespace, key)
            .then( result => callback(null , result ))
            .catch( callback )
        }
    });
    
    server.bind(`${ip}:${port}`, grpc.ServerCredentials.createInsecure())
    server.start();
    return server;
}

module.exports = {
    init
}