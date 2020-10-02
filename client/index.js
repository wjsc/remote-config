const fs = require('fs');
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const NOT_ENCRYPTED_DATA_MESSAGE = 'error:04099079:rsa routines:RSA_padding_check_PKCS1_OAEP_mgf1:oaep decoding error';
const PROTO_PATH = './keys.proto'
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition);
const ConfigService = proto.ConfigService
const client = new ConfigService('127.0.0.1:3000', grpc.credentials.createInsecure());
const security = require('./security');
const passphrase = 'hello-world';
const privateKey = fs.readFileSync('../launcher/private', 'utf8')

client.get({namespace: "ns", key: "key5"}, (error, config) => {
    try{
        console.log(config.value && security.privateDecrypt(config.value, privateKey, passphrase ));
    }
    catch(err){
        if(err.message !== NOT_ENCRYPTED_DATA_MESSAGE){
            throw err;
        }
        console.log(config.value);
    }
});

