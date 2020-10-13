const assert = require('assert');

const createClientCredentials = (grpc, privateKey, caCertificate, clientCertificate) => {
    if(!caCertificate){
        console.warn('Client connecting without SSL/TLS Authentication');
        return createInsecureClientCredentials(grpc);
    }
    if(!clientCertificate){
        console.warn('Client connecting without Mutual SSL/TLS');
        return createSslServerCredentials(grpc, caCertificate);
    }
    assert(caCertificate, 'SSL/TLS Authentication: CA certificate is required');
    assert(privateKey, 'SSL/TLS Authentication: Client private key is required');
    assert(clientCertificate, 'SSL/TLS Authentication: Client certificate is required' );
    return createSslMutualCredentials(grpc, caCertificate, privateKey, clientCertificate);
}

const createSslMutualCredentials = ( grpc, caCertificate, privateKey, clientCertificate ) => 
    grpc.credentials.createSsl(
        Buffer.from(caCertificate, 'utf8'),
        Buffer.from(privateKey, 'utf8'),
        Buffer.from(clientCertificate, 'utf8')
    );

const createSslServerCredentials = ( grpc, caCertificate, ) => 
    grpc.credentials.createSsl(
        Buffer.from(caCertificate, 'utf8')
    );

const createInsecureClientCredentials = grpc => grpc.credentials.createInsecure();

module.exports = {
    createClientCredentials
}