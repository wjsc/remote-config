const crypto = require("crypto");

const publicEncrypt = (utf8Data, key) => 
    crypto.publicEncrypt(key, Buffer.from(utf8Data, 'utf8')).toString('base64');


const privateDecrypt = (base64Data, key) => 
    crypto.privateDecrypt({ key }, Buffer.from(base64Data,'base64') ).toString('utf8');

const privateEncrypt = (utf8Data, key) => 
    crypto.privateEncrypt({ key}, Buffer.from(utf8Data, 'utf8')).toString('base64');


const defaultRSAKeyPairOptions = {
    modulusLength: 4096,
    namedCurve: 'secp256k1', 
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'     
    },     
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc'
    } 
};

const defaultType = 'rsa';

const generateKeys = (type, RSAKeyPairOptions = {}) =>  
    crypto.generateKeyPairSync(
        type || defaultType, 
        Object.assign(defaultRSAKeyPairOptions, RSAKeyPairOptions)
    );

module.exports = {
    generateKeys,
    publicEncrypt,
    privateDecrypt,
    privateEncrypt
}
