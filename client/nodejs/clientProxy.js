const LIMIT = ':';


const formatNamespace = (secure, privateEncrypt, namespace, privateKey) => secure 
    ? namespace + LIMIT + privateEncrypt(namespace, privateKey) 
    : namespace;

const get = ( { privateEncrypt, privateDecrypt }, get, privateKey ) => {
    return new Proxy(get, {
        apply: (target, thisArg, [{ namespace, key, secure = true }, callback]) => {
            return target.call(thisArg, {
                    namespace: formatNamespace(secure, privateEncrypt, namespace, privateKey),
                    key,
                }, 
                (error, configResult) => callback(error, {
                    namespace,
                    key,
                    value: secure ? privateDecrypt( configResult.value, privateKey ) : configResult.value
                })
            );
        }
    });
}

const set = ( { privateEncrypt, publicEncrypt }, set, privateKey ) => {
    return new Proxy(set, {
        apply: (target, thisArg, [{ namespace, key, value, secure = true }, callback]) => {
            return target.call(thisArg, {
                    namespace: formatNamespace(secure, privateEncrypt, namespace, privateKey),
                    key,
                    value: secure ? publicEncrypt( value, privateKey ) : value,
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