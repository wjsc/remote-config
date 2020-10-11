const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader')

const options = {};

const init = (security, credentials, clientProxy, protoPath) => ( host, privateKey, caCertificate, clientCertificate ) => {
    const packageDefinition = protoLoader.loadSync(protoPath);
    const proto = grpc.loadPackageDefinition(packageDefinition);
    const ConfigService = proto.ConfigService;
    const clientCredentials = credentials.createClientCredentials(grpc, privateKey, caCertificate, clientCertificate);
    const client = new ConfigService(host, clientCredentials, options);

    client.get = clientProxy.get(security, client.get, privateKey);
    client.set = clientProxy.set(security, client.set, privateKey);

    return client;
};

module.exports = {
    init
}