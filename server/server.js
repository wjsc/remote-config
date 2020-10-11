const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const get = storage => ({ request: { namespace, key } }, callback) =>
    storage.get(namespace, key)
    .then( result => callback(null , result ))
    .catch( callback );

const set = storage => ({ request: { namespace, key, value } }, callback) =>
    storage.set(namespace, key, value)
    .then( result => callback(null , result ))
    .catch( callback );

const del = storage => ({ request: { namespace, key } }, callback) => 
    storage.del(namespace, key)
    .then( result => callback(null , result ))
    .catch( callback );

const init = (storage, credentials, protoPath, host, caCertificate, privateKey, serverCertificate ) => {

    const packageDefinition = protoLoader.loadSync(protoPath);
    const proto = grpc.loadPackageDefinition(packageDefinition);
    const server = new grpc.Server()
     
    server.addService(proto.ConfigService.service, {
        get: get(storage), 
        set: set(storage), 
        del: del(storage)
    });
    
    const serverCredentials = credentials.createServerCredentials(grpc, caCertificate, privateKey, serverCertificate);
    server.bind(host, serverCredentials);
    server.start();
    return server;
}

module.exports = {
    init
}