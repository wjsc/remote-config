const { program } = require('commander');
program
    .requiredOption('-r, --private <path>', 'Private key path')
    .requiredOption('-p, --passphrase <path>', 'Passphrase')
    .requiredOption('-n, --namespace <namespace>', 'Config namespace')
    .requiredOption('-k, --key <key>', 'Config key')
    .requiredOption('-h, --host <value>', 'Remote config server ip:port')
    .parse(process.argv);


const client = require('../client/index').init(
    program.host,
    program.passphrase,
    program.private
)

client.get( { 
        namespace: program.namespace , 
        key: program.key
    }, 
    (err, config) => {
        err ? console.error(err) : console.log(config)
    }
);
