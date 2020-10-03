const { program } = require('commander');
program
    .requiredOption('-r, --private <path>', 'Private key path')
    .requiredOption('-p, --passphrase <path>', 'Passphrase')
    .requiredOption('-n, --namespace <namespace>', 'Config namespace')
    .requiredOption('-k, --key <key>', 'Config key')
    .parse(process.argv);


const client = require('../client/index').init(
    '127.0.0.1',
    3000,
    program.passphrase,
    program.private
)

client.get( { 
        namespace: program.namespace , 
        key: program.key
    }, 
    (err, config) => {
        err ? console.error(error) : console.log(config)
    }
);
