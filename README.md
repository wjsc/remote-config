# remote-config

- Externalized config server & client with built-in encryption for microservices architecture: https://microservices.io/patterns/externalized-configuration.html

## General

- Architecture:
    - Storage engine: redis, mongodb, dynamodb or filesystem
    - remote-config-server: https://hub.docker.com/r/imageswjsc/remote-config-server
    - remote-config-client for nodejs: https://www.npmjs.com/package/@wjsc/remote-config-client
    - remote-config-client for Command line interface(CLI)

- The remote-config server stores remote-configs with this structure:
    - namespace
    - key
    - value

- Every remote-config stored has client side encryption with asymetric keys.
- value is encrypted with public key and it's only accesible by the remote-config owner


## Getting started
### 1. Start redis as storage engine
```
docker run --name remote-config-db-redis -p6379:6379 -d redis
```

### 2. Generate private & public keys for a specific namespace for full TLS/SSL authentication
- You can ignore this step if no authentication is required

#### 2.1. Install certstrap
```
wget https://github.com/square/certstrap/releases/download/v1.1.1/certstrap-v1.1.1-linux-amd64
mv certstrap-v1.1.1-linux-amd64 certstrap
chmod +x certstrap
```
#### 2.2. Generating a root certificate authority 
```
certstrap init --organization "ca" --common-name "ca"
```
#### 2.3. Generating a server certificate & Sign server certificate 
```
certstrap request-cert --common-name "server" --domain "localhost"
certstrap sign --CA ca "server"
```
#### 2.4. Create client certificate & Sign client certificate 
```
certstrap request-cert --common-name "client"
certstrap sign --CA ca "client"
```

#### 2.5. Move files to folders
```
cp ./out/ca.crt ./server/certs
cp ./out/server* ./server/certs
cp ./out/ca.crt ./client/cli/certs
cp ./out/client* ./client/cli/certs
```

### 3. Run remote-config server and connect to redis storage
- If no authentication is required, remove CA_CERT_PATH, KEY_PATH & CERT_PATH from command

```
docker run -p3000:3000 \
    -e STORAGE=redis \
    -e DATABASE_HOST=host.docker.internal \
    -e DATABASE_PORT=6379 \
    -e HOST=0.0.0.0 \
    -e PORT=3000 \
    -v $PWD/certs:/home/node/certs/ \
    -e CA_CERT_PATH=/home/node/certs/ca.crt \
    -e KEY_PATH=/home/node/certs/server.key \
    -e CERT_PATH=/home/node/certs/server.crt \
    --name remote-config-server-redis \
    -d imageswjsc/remote-config-server
```

### 4. Install CLI client dependencies
```
cd ./client/cli
npm i
```


### 5. Test saving & retrieving a remote-config with encryption
```
cd ./client/cli

node set_config.js -r certs/client.key -l certs/client.crt -a certs/ca.crt -n ns1 -k key1 -h localhost:3000
// The CLI will prompt for value
// output: { namespace: 'ns1', key: 'key1', value: 'value1' }

node get_config.js  -r certs/client.key -l certs/client.crt -a certs/ca.crt -n ns1 -k key1 -h localhost:3000
// output: { namespace: 'ns1', key: 'key1', value: 'value1' }
```

### 6. Test saving & retrieving a remote-config without encryption
```
cd ./client/cli

node set_config.js -r certs/client.key -l certs/client.crt -a certs/ca.crt -n ns2 -k key2 -h localhost:3000 -x
// The CLI will prompt for value
// output: { namespace: 'ns2', key: 'key2', value: 'value2' }

node get_config.js -r certs/client.key -l certs/client.crt -a certs/ca.crt -n ns2 -k key2 -h localhost:3000 -x
// output: { namespace: 'ns2', key: 'key2', value: 'value2' }
```


### CLI Client help

#### 1. Retrieve a remote config
```
node get_config.js --help
Usage: get_config [options]

Options:
  -x, --share                  Do not encrypt value
  -r, --private <path>         Client private key path
  -l, --clientcert <path>      Client Certificate path
  -a, --cacert <path>          CA Certificate path
  -n, --namespace <namespace>  Config namespace
  -k, --key <key>              Config key
  -h, --host <value>           Remote config server ip:port
  --help                       display help for command

```

#### 2. Save a remote config
```
node set_config.js --help
Usage: set_config [options]

Options:
  -x, --share                  Do not encrypt value
  -r, --private <path>         Client private key path
  -l, --clientcert <path>      Client Certificate path
  -a, --cacert <path>          CA Certificate path
  -n, --namespace <namespace>  Config namespace
  -k, --key <key>              Config key
  -h, --host <value>           Remote config server ip:port
  --help                       display help for command
```


### Run remote-config-server and connect to filesystem as storage engine
```
docker run -p3000:3000 \
    -e STORAGE=filesystem \
    -v $PWD/data:/home/node/.storage \
    -e HOST=0.0.0.0 \
    -e PORT=3000 \
    --name remote-config-server-fs \
    -v $PWD/certs:/home/node/certs/ \
    -e CA_CERT_PATH=/home/node/certs/ca.crt \
    -e KEY_PATH=/home/node/certs/server.key \
    -e CERT_PATH=/home/node/certs/server.crt \
    -d imageswjsc/remote-config-server
```


### Run remote-config-server and connect to mongodb as storage engine
```
docker run --name remote-config-db-mongodb -p27017:27017 -d mongo
docker run -p3000:3000 \
    -e STORAGE=mongodb \
    -e DATABASE_HOST=host.docker.internal \
    -e DATABASE_PORT=27017 \
    -e DATABASE_NAME=remote-config-storage \
    -e DATABASE_COLLECTION=remote-config-collection \
    -e HOST=0.0.0.0 \
    -e PORT=3000 \
    -v $PWD/certs:/home/node/certs/ \
    -e CA_CERT_PATH=/home/node/certs/ca.crt \
    -e KEY_PATH=/home/node/certs/server.key \
    -e CERT_PATH=/home/node/certs/server.crt \
    --name remote-config-server-mongodb \
    -d imageswjsc/remote-config-server
```

### Run remote-config-server and connect to dynamodb as storage engine
```
docker run --name remote-config-db-dynamodb -p8000:8000 -d amazon/dynamodb-local
docker run -p3000:3000 \
    -e STORAGE=dynamodb \
    -e AWS_REGION=us-east-1 \
    -e DYNAMODB_ENDPOINT=http://localhost:8000 \
    -e DATABASE_TABLENAME=remote-config-storage \
    -e DYNAMODB_CAPACITY_READ=5 \
    -e DYNAMODB_CAPACITY_WRITE=5 \
    -e HOST=0.0.0.0 \
    -e PORT=3000 \
    -v $PWD/certs:/home/node/certs/ \
    -e CA_CERT_PATH=/home/node/certs/ca.crt \
    -e KEY_PATH=/home/node/certs/server.key \
    -e CERT_PATH=/home/node/certs/server.crt \
    --name remote-config-server-dynamodb \
    -d imageswjsc/remote-config-server
```

### Environment variables supported
```
STORAGE: Storage engine. Redis OR mongodb OR filesystem
DATABASE_HOST: Database connection endpoint
DATABASE_PORT: Database connection port
DATABASE_NAME: Database name
DATABASE_COLLECTION: Optional. Only when using mongodb as storage engine.
HOST: Server binding IP
PORT: Server binding port
CA_CERT_PATH: Optional. Certificate authority certificate path for SSL/TLS authentication. This file must be mounted.
KEY_PATH: Optional. Server private key path for SSL/TLS authentication. This file must be mounted.
CERT_PATH: Optional. Server certificate path for SSL/TLS authentication. This file must be mounted.
IGNORE_CLIENT_CERT: Ignore client certificate, only authenticate server.
AWS_REGION: Optional. Region for dynamodb.
AWS_ENDPOINT: Optional. Endpoint for dynamodb service
AWS_ACCESS_KEY_ID: Optional. Only for dynamodb. 
AWS_SECRET_ACCESS_KEY: Optional. Only for dynamodb.
DATABASE_TABLENAME: Optional. Only for dynamodb.
DYNAMODB_CAPACITY_READ: Optional. Only for dynamodb.
DYNAMODB_CAPACITY_WRITE: Optional. Only for dynamodb.

/// If CA_CERT_PATH, KEY_PATH & CERT_PATH are not defined, the server can run in insecure mode
```
