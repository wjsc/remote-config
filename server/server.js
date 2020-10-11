const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const promiseToCallback = (promise, callback) => 
    promise
    .then( result => callback(null , result ))
    .catch( callback );

const get = storage => ({ request: { namespace, key } }, callback) =>
    promiseToCallback(storage.get(namespace, key), callback)

const set = storage => ({ request: { namespace, key, value } }, callback) =>
    promiseToCallback(storage.set(namespace, key, value), callback)

const del = storage => ({ request: { namespace, key } }, callback) => 
    promiseToCallback(storage.del(namespace, key), callback)

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