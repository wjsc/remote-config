const fs = require('fs');
const { program } = require('commander');
const { security } = require('@wjsc/remote-config-client');


program
    .requiredOption('-u, --public <path>', 'Public key path')
    .requiredOption('-r, --private <path>', 'Private key path')
    .option('-p, --passphrase <passphrase>', 'Passphrase')
    .parse(process.argv);

const { privateKey, publicKey } = security.generateKeys(program.passphrase);

fs.writeFileSync(program.public, publicKey, 'utf8');
fs.writeFileSync(program.private, privateKey, 'utf8');

process.exit(0);