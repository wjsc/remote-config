# remote-config-grpc 

## General

- Architecture:
    - Storage engine: redis or filesystem
    - remote-config Server connected to storage engine
    - remote-config Client for nodejs: https://www.npmjs.com/package/@wjsc/remote-config-client
    - remote-config Client for Command line interface(CLI)

- The remote-config server stores remote-configs with this structure:
    - namespace
    - key
    - value

- Every remote-config stored has client side encryption with asymetric keys.
- namespace & key are encrypted with private key to avoid collisions with other clients
- value is encrypted with public key and it's only accesible by the remote-config owner


## Getting started
### 1. Start redis as storage engine
```
docker run --name remote-config-db -p6379:6379 -d redis
```

### 2. Build remote config server and connect to redis storage
```
cd ./server
docker build -t remote-config-server:1.0 . 
docker run -p3000:3000 \
    -e DATABASE_HOST=host.docker.internal \
    -e DATABASE_PORT=6379 \
    -e HOST=0.0.0.0 \
    -e PORT=3000 \
    --name remote-config-server-redis \
    -d remote-config-server:1.0
```

### 3. Install CLI client dependencies
```
cd ./client/cli
npm i
```

### 4. Generate private & public keys for a specific namespace
```
cd ./client/cli
node generate_keys.js -u public.pub -r private -p pass20
```

### 5. Test saving & retrieving a remote-config
```
cd ./client/cli
node set_config.js -u public.pub -r private -p pass20 -n ns20 -k key20 -v value20 -h 127.0.0.1:3000
// output: { namespace: 'ns20', key: 'key20', value: 'value20' }
node get_config.js -r private -p pass20 -n ns20 -k key20 -h 127.0.0.1:3000
// output: { namespace: 'ns20', key: 'key20', value: 'value20' }
```


### CLI Client help

#### 1. Generate keys
```
node generate_keys.js --help
Usage: generate_keys [options]

Options:
  -u, --public <path>            Public key path
  -r, --private <path>           Private key path
  -p, --passphrase <passphrase>  Passphrase
  -h, --help                     display help for command
```

#### 2. Retrieve a remote config
```
node get_config.js --help
Usage: get_config [options]

Options:
  -r, --private <path>         Private key path
  -p, --passphrase <path>      Passphrase
  -n, --namespace <namespace>  Config namespace
  -k, --key <key>              Config key
  -h, --host <value>           Remote config server ip:port
  --help                       display help for command

```

#### 3. Save a remote config
```
node set_config.js --help
Usage: set_config [options]

Options:
  -u, --public <path>          Public key path
  -r, --private <path>         Private key path
  -p, --passphrase <path>      Passphrase
  -n, --namespace <namespace>  Config namespace
  -k, --key <key>              Config key
  -v, --value <value>          Config value
  -h, --host <value>           Remote config server ip:port
  --help                       display help for command
```


### Build remote config server and connect to filesystem storage
```
cd ./server
docker build -t remote-config-server:1.0 .
docker run -p3000:3000 \
    -v $PWD/data:/home/node/.storage \
    -e HOST=0.0.0.0 \
    -e PORT=3000 \
    --name remote-config-server-fs \
    -d remote-config-server:1.0
```
