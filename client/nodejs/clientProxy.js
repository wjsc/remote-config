const LIMIT = ':';


const formatNamespace = (secure, privateEncrypt, namespace, privateKey, passphrase) => secure 
    ? namespace + LIMIT + privateEncrypt(namespace, privateKey, passphrase) 
    : namespace;

const get = ( { privateEncrypt, privateDecrypt }, get, privateKey, passphrase ) => {
    return new Proxy(get, {
        apply: (target, thisArg, [{ namespace, key, secure = true }, callback]) => {
            return target.call(thisArg, {
                    namespace: formatNamespace(secure, privateEncrypt, namespace, privateKey, passphrase),
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

const set = ( { privateEncrypt, publicEncrypt }, set, privateKey, passphrase, publicKey ) => {
    return new Proxy(set, {
        apply: (target, thisArg, [{ namespace, key, value, secure = true }, callback]) => {
            return target.call(thisArg, {
                    namespace: formatNamespace(secure, privateEncrypt, namespace, privateKey, passphrase),
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