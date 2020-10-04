const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader')

const init = (storage, protoPath, host) => {

    const packageDefinition = protoLoader.loadSync(protoPath);
    const proto = grpc.loadPackageDefinition(packageDefinition);
    const server = new grpc.Server()
     
    server.addService(proto.ConfigService.service, {
        get: ({ request: { namespace, key } }, callback) => {
            storage.get(namespace, key)
            .then( result => callback(null , result ))
            .catch( callback )
        },
        set: ({ request: { namespace, key, value } }, callback) => {
            storage.set(namespace, key, value)
            .then( result => callback(null , result ))
            .catch( callback )
        },
        del: ({ request: { namespace, key } }, callback) => {
            storage.del(namespace, key)
            .then( result => callback(null , result ))
            .catch( callback )
        }
    });
    
    server.bind(host, grpc.ServerCredentials.createInsecure());
    server.start();
    return server;
}

module.exports = {
    init
}