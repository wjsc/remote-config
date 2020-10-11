const assert = require('assert');

const createClientCredentials = (grpc, privateKey, caCertificate, clientCertificate) => {
    if(!caCertificate && !privateKey && !clientCertificate){
        console.warn('Client connecting without SSL/TLS Authentication');
        return createInsecureClientCredentials(grpc);
    }
    assert(caCertificate, 'SSL/TLS Authentication: CA certificate is required');
    assert(privateKey, 'SSL/TLS Authentication: Client private key is required');
    assert(clientCertificate, 'SSL/TLS Authentication: Client certificate is required' );
    return createSslClientCredentials(grpc, caCertificate, privateKey, clientCertificate, true);
}

const createSslClientCredentials = ( grpc, caCertificate, privateKey, clientCertificate ) => 
    grpc.credentials.createSsl(
        Buffer.from(caCertificate, 'utf8'),
        Buffer.from(privateKey, 'utf8'),
        Buffer.from(clientCertificate, 'utf8')
    );

const createInsecureClientCredentials = grpc => grpc.credentials.createInsecure();

module.exports = {
    createClientCredentials
}