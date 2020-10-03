const crypto = require("crypto");

const publicEncrypt = (utf8Data, key) => 
    crypto.publicEncrypt(key, Buffer.from(utf8Data, 'utf8')).toString('base64');
;

const privateDecrypt = (base64Data, key, passphrase) => 
    crypto.privateDecrypt({ key, passphrase }, Buffer.from(base64Data,'base64') ).toString('utf8');

const privateEncrypt = (utf8Data, key, passphrase) => 
    crypto.privateEncrypt({ key, passphrase}, Buffer.from(utf8Data, 'utf8')).toString('base64');


const generateKeys = (passphrase) =>  {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', 
        {
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
        }
    );
    return {
        privateKey,
        publicKey
    }
}

module.exports = {
    generateKeys,
    publicEncrypt,
    privateDecrypt,
    privateEncrypt
}
