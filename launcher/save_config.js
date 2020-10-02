const { program } = require('commander');

program
    .option('-u, --public <path>', 'Public key path')
    .option('-r, --private <path>', 'Private key path')
    .option('-p, --passphrase <passphrase>', 'Passphrase')
    .requiredOption('-n, --namespace <namespace>', 'Config namespace')
    .requiredOption('-k, --key <key>', 'Config key')
    .requiredOption('-v, --value <value>', 'Config value')
    .parse(process.argv);


if (program.help) console.log(program.opts());

const fs = require('fs');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader')
const PROTO_PATH = './keys.proto'
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition);
const ConfigService = proto.ConfigService
const client = new ConfigService('127.0.0.1:3000', grpc.credentials.createInsecure());
const security = require('../client/security');

const passphrase = program.passphrase;

const privateKey = program.private && fs.readFileSync(program.private, 'utf8');
const publicKey = program.public && fs.readFileSync(program.public, 'utf8');

const encriptedValue = publicKey && security.publicEncrypt(program.value, publicKey );

client.set( { 
    namespace: program.namespace, 
    key: program.key, 
    value: encriptedValue || program.value
    }, 
    (err, config) => {
        err ? console.error(error) : console.log(config)
    }
);
