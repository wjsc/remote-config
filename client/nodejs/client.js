const fs = require('fs');
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const clientProxy = require('./clientProxy');

const init = (security, protoPath) => ( host, passphrase, private, public, ca_cert, client_key, client_cert ) => {
    const packageDefinition = protoLoader.loadSync(protoPath);
    const proto = grpc.loadPackageDefinition(packageDefinition);
    const ConfigService = proto.ConfigService

    const clientCredentials = createClientCredentials(grpc, ca_cert, client_key, client_cert);

    const client = new ConfigService(host, clientCredentials);
    const privateKey = private && fs.readFileSync(private, 'utf8');
    const publicKey = public && fs.readFileSync(public, 'utf8');

    client.get = clientProxy.get(security, client.get, privateKey, passphrase);
    client.set = clientProxy.set(security, client.set, privateKey, passphrase, publicKey);

    return client;
};

const createClientCredentials = (grpc, ca_cert, client_key, client_cert) => {
    if(!ca_cert && !client_key && !client_cert){
        console.warn('Client connecting without SSL/TLS Authentication');
        return createInsecureClientCredentials(grpc);
    }
    assert(ca_cert, 'SSL/TLS Authentication: CA certificate is required');
    assert(client_key, 'SSL/TLS Authentication: Client private key is required');
    assert(client_cert, 'SSL/TLS Authentication: Client certificate is required' );
    return createSslClientCredentials(grpc, ca_cert, server_key, server_cert, true);
}

const createSslClientCredentials = ( grpc, ca_cert, client_key, client_cert ) => 
    grpc.credentials.createSsl(
        fs.readFileSync(ca_cert),
        fs.readFileSync(client_key),
        fs.readFileSync(client_cert)
    );

const createInsecureClientCredentials = grpc => grpc.credentials.createInsecure();


module.exports = {
    init
}