const LIMIT = ':';

const get = ( { privateDecrypt, hash }, get, privateKey, passphrase ) => {
    return new Proxy(get, {
        apply: (target, thisArg, [{ namespace, key, secure = true }, callback]) => {
            return target.call(thisArg, {
                    namespace: namespace + LIMIT + hash(namespace),
                    key,
                }, 
                (error, configResult) => callback(error, {
                    namespace,
                    key,
                    value: secure ? privateDecrypt( configResult.value, privateKey, passphrase ) : configResult.value
                })
            );
        }
    });
}

const set = ( { publicEncrypt, hash }, set, publicKey ) => {
    return new Proxy(set, {
        apply: (target, thisArg, [{ namespace, key, value, secure = true }, callback]) => {
            return target.call(thisArg, {
                    namespace: namespace + LIMIT  + hash(namespace),
                    key,
                    value: secure ? publicEncrypt( value, publicKey ) : value,
                }, 
                (error, _) => callback(error, { namespace, key, value })
            );
        }
    });
}

module.exports = {
    get, 
    set
}