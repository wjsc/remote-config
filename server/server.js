const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader')
const assert = require('assert');

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

const init = (storage, protoPath, host, ca_cert, server_key, server_cert ) => {

    const packageDefinition = protoLoader.loadSync(protoPath);
    const proto = grpc.loadPackageDefinition(packageDefinition);
    const server = new grpc.Server()
     
    server.addService(proto.ConfigService.service, {
        get: get(storage), 
        set: set(storage), 
        del: del(storage)
    });
    
    const serverCredentials = createServerCredentials(grpc, ca_cert, server_key, server_cert);
    server.bind(host, serverCredentials);
    server.start();
    return server;
}

const createServerCredentials = (grpc, ca_cert, server_key, server_cert) => {
    if(!ca_cert && !server_key && !server_cert){
        console.warn('Server running without SSL/TLS Authentication');
        return createInsecureServerCredentials(grpc);
    }
    assert(ca_cert, 'SSL/TLS Authentication: CA certificate is required');
    assert(server_key, 'SSL/TLS Authentication: Server private key is required');
    assert(server_cert, 'SSL/TLS Authentication: Server certificate is required' );
    return createSslServerCredentials(grpc, ca_cert, server_key, server_cert, true);
}

const createSslServerCredentials = ( grpc, ca_cert, server_key, server_cert, checkClientCertificate = true ) => 
    grpc.ServerCredentials.createSsl( 
        fs.readFileSync( ca_cert ),
        [{
            private_key: fs.readFileSync( server_key ),
            cert_chain: fs.readFileSync( server_cert )
        }],
        checkClientCertificate
        
    );

const createInsecureServerCredentials = grpc => grpc.ServerCredentials.createInsecure();

module.exports = {
    init
}