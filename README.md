# remote-config-grpc 

Externalized config server with built-in encryption for microservices architecture

## General

- Architecture:
    - Storage engine: redis, mongodb or filesystem
    - remote-config Server connected to storage engine
    - remote-config Client for nodejs: https://www.npmjs.com/package/@wjsc/remote-config-client
    - remote-config Client for Command line interface(CLI)

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

### 2. Build remote config server and connect to redis storage
```
cd ./server
docker build -t remote-config-server:1.0 . 
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
    -d remote-config-server:1.0
```

### 3. Install CLI client dependencies
```
cd ./client/cli
npm i
```

### 4. Generate private & public keys for a specific namespace for full TLS/SSL authentication
- Server private key & certificate
- Client private key & certificate 
- Certificate authority certificate


### 5. Test saving & retrieving a remote-config with encryption
```
cd ./client/cli

node set_config.js -r certs/client.key -l certs/client.crt -a certs/ca.crt -n ns1 -k key1 -v value1 -h 127.0.0.1:3000
// output: { namespace: 'ns1', key: 'key1', value: 'value1' }

node get_config.js  -r certs/client.key -l certs/client.crt -a certs/ca.crt -n ns1 -k key1 -h 127.0.0.1:3000
// output: { namespace: 'ns1', key: 'key1', value: 'value1' }
```

### 6. Test saving & retrieving a remote-config without encryption
```
cd ./client/cli

node set_config.js -r certs/client.key -l certs/client.crt -a certs/ca.crt -n ns2 -k key2 -v value2 -h 127.0.0.1:3000 -x
// output: { namespace: 'ns2', key: 'key2', value: 'value2' }

node get_config.js -r certs/client.key -l certs/client.crt -a certs/ca.crt -n ns2 -k key2 -h 127.0.0.1:3000 -x
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
  -v, --value <value>          Config value
  -h, --host <value>           Remote config server ip:port
  --help                       display help for command
```


### Build remote config server and connect to filesystem as storage engine
```
cd ./server
docker build -t remote-config-server:1.0 .
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
    -d remote-config-server:1.0
```


### Build remote config server and connect to mongodb as storage engine
```
docker run --name remote-config-db-mongodb -p27017:27017 -d mongo
cd ./server
docker build -t remote-config-server:1.0 .
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
    -d remote-config-server:1.0
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

/// If CA_CERT_PATH, KEY_PATH & CERT_PATH are not defined, the server can run in insecure mode
```
