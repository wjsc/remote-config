### 1. Start redis as persistent engine
```
docker run --name remote-config-db -p6379:6379 -d redis
```

### 2. Build remote config server
```
docker build -t remote-config-grpc-server:1.0 . &&
docker run -p3000:3000 \
    -e DATABASE_HOST=host.docker.internal \
    -e DATABASE_PORT=6379 \
    -e HOST=0.0.0.0 \
    -e PORT=3000 \
    remote-config-grpc-server:1.0
```

### 3. Install dependencies
```
cd ./server
npm i
cd ../client
npm i
cd ../admin
npm i
cd ..
```

### 4. Generate private & public keys
```
cd ./admin
node generate_keys.js -u public.pub -r private -p pass19
```

### 5. Test saving & retrieving a remote config
```
cd ./admin
node set_config.js -u public.pub -r private -p pass19 -n ns19 -k key19 -v value19
node get_config.js -r private -p pass19 -n ns19 -k key19
```