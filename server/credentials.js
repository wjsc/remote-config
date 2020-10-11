const assert = require('assert');

const createServerCredentials = (grpc, caCertificate, privateKey, serverCertificate) => {
    if(!caCertificate && !privateKey && !serverCertificate){
        console.warn('Server running without SSL/TLS Authentication');
        return createInsecureServerCredentials(grpc);
    }
    assert(caCertificate, 'SSL/TLS Authentication: CA certificate is required');
    assert(privateKey, 'SSL/TLS Authentication: Server private key is required');
    assert(serverCertificate, 'SSL/TLS Authentication: Server certificate is required' );
    return createSslServerCredentials(grpc, caCertificate, privateKey, serverCertificate, true);
}

const createSslServerCredentials = ( grpc, caCertificate, privateKey, serverCertificate, checkserverCertificate = true ) => 
    grpc.ServerCredentials.createSsl( 
        Buffer.from(caCertificate, 'utf8'),
        [{
            private_key: Buffer.from(privateKey, 'utf8'),
            cert_chain: Buffer.from(serverCertificate, 'utf8') 
        }],
        checkserverCertificate
        
    );

const createInsecureServerCredentials = grpc => grpc.ServerCredentials.createInsecure();

module.exports = {
    createServerCredentials
}