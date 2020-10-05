const fs = require('fs');
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const clientProxy = require('./clientProxy');

const init = (security, protoPath) => ( host, passphrase, private, public ) => {
    const packageDefinition = protoLoader.loadSync(protoPath);
    const proto = grpc.loadPackageDefinition(packageDefinition);
    const ConfigService = proto.ConfigService
    const client = new ConfigService(host, grpc.credentials.createInsecure());
    const privateKey = fs.readFileSync(private, 'utf8');
    const publicKey = public && fs.readFileSync(public, 'utf8');

    client.get = clientProxy.get(security, client.get, privateKey, passphrase);
    client.set = clientProxy.set(security, client.set, privateKey, passphrase, publicKey);

    return client;
};

module.exports = {
    init
}