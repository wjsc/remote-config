const get = ( security, get, privateKey, passphrase) => {
    return new Proxy(get, {
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
}

const set = ( security, set, privateKey, passphrase, publicKey ) => {
    return new Proxy(set, {
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
                (error, _) => callback(error, 
                    config
                )
            );
        }
    });
}

module.exports = {
    get, 
    set
}