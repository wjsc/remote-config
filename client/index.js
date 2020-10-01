const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const PROTO_PATH = './keys.proto'
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition);
const ConfigService = proto.ConfigService
const client = new ConfigService('127.0.0.1:3000', grpc.credentials.createInsecure());
const security = require('./security');
const passphrase = 'hello-world';
const { privateKey, publicKey } = security.generateKeys(passphrase);

const encriptedValue = security.publicEncrypt("my-secret-value", publicKey );

client.set({namespace: "my-namespace", key: "my-key", value: encriptedValue }, (error, config) => {
    client.get({namespace: "my-namespace", key: "my-key"}, (error, config) => {
        console.log(security.privateDecrypt(config.value, privateKey, passphrase ));
    })
})
