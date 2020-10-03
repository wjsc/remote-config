const fs = require('fs');
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const security = require('./security');

const init = (ip, port, passphrase, private, public = false) => {
    const packageDefinition = protoLoader.loadSync('../keys.proto');
    const proto = grpc.loadPackageDefinition(packageDefinition);
    const ConfigService = proto.ConfigService
    const client = new ConfigService(`${ip}:${port}`, grpc.credentials.createInsecure());;
    const privateKey = fs.readFileSync(private, 'utf8');
    const publicKey = public && fs.readFileSync(public, 'utf8');

    client.get = new Proxy(client.get, {
        apply: (target, thisArg, [config, callback]) => {
            return target.call(thisArg, {
                    namespace: security.privateEncrypt(
                        config.namespace, privateKey, passphrase
                    ),
                    key: security.privateEncrypt(
                        config.key, privateKey, passphrase
                    ),
                }, 
                (error, configResult) => callback(error, {
                    ...config,
                    value: security.privateDecrypt(
                        configResult.value, privateKey, passphrase 
                    )
                })
            );
        }
    });

    client.set = new Proxy(client.set, {
        apply: (target, thisArg, [config, callback]) => {
            return target.call(thisArg, {
                    namespace: security.privateEncrypt(
                        config.namespace, privateKey, passphrase
                    ),
                    key: security.privateEncrypt(
                        config.key, privateKey, passphrase
                    ),
                    value: security.publicEncrypt(
                        config.value, publicKey
                    ),
                }, 
                (error, configResult) => callback(error, {
                    ...config
                })
            );
        }
    });

    return client;
};

module.exports = {
    init
}