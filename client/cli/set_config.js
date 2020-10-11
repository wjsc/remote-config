const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const fs = require('fs');
const { program } = require('commander');

program
    .option('-x, --share', 'Do not encrypt value')
    .option('-r, --private <path>', 'Client private key path')
    .option('-l, --clientcert <path>', 'Client Certificate path')
    .option('-a, --cacert <path>', 'CA Certificate path')
    .requiredOption('-n, --namespace <namespace>', 'Config namespace')
    .requiredOption('-k, --key <key>', 'Config key')
    .requiredOption('-h, --host <value>', 'Remote config server ip:port')
    .parse(process.argv);

const loadFile = path => path && fs.readFileSync(path, 'utf8');

const client = require('@wjsc/remote-config-client').init(
    program.host,
    loadFile(program.private),
    loadFile(program.cacert),
    loadFile(program.clientcert)
);

rl.question("Value? ", value => {
    client.set( { 
            namespace: program.namespace , 
            key: program.key, 
            value,
            secure: !program.share
        }, 
        (err, config) => {
            if(!err) {
                console.log(config);
                process.exit(0);
            } 
            console.error(err);
            process.exit(1);
        }
    );
});

rl.on("close", () => {
    process.exit(0);
});

