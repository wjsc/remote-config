const crypto = require("crypto");

const hash = (str, algorithm, options) => 
    crypto.createHash(algorithm || 'sha256', options).update(str).digest("hex");

const publicEncrypt = (utf8Data, key) => 
    crypto.publicEncrypt(key, Buffer.from(utf8Data, 'utf8')).toString('base64');


const privateDecrypt = (base64Data, key, passphrase) => 
    crypto.privateDecrypt({ key, passphrase }, Buffer.from(base64Data,'base64') ).toString('utf8');

const privateEncrypt = (utf8Data, key, passphrase) => 
    crypto.privateEncrypt({ key, passphrase}, Buffer.from(utf8Data, 'utf8')).toString('base64');


const defaultRSAKeyPairOptions = passphrase => ({
    modulusLength: 4096,
    namedCurve: 'secp256k1', 
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'     
    },     
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase
    } 
});

const defaultType = 'rsa';

const generateKeys = (passphrase, type, RSAKeyPairOptions = {}) =>  
    crypto.generateKeyPairSync(
        type || defaultType, 
        Object.assign(defaultRSAKeyPairOptions(passphrase), RSAKeyPairOptions)
    );

module.exports = {
    generateKeys,
    publicEncrypt,
    privateDecrypt,
    privateEncrypt,
    hash
}
