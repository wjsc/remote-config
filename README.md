### Start container with redis
```
docker run --name remote-config-db -p6379:6379 -d redis
```

### Build server
```
docker build -t remote-config-grpc-server:1.0 . &&
docker run -p3000:3000 \
    -e DATABASE_HOST=host.docker.internal \
    -e DATABASE_PORT=6379 \
    -e HOST=0.0.0.0 \
    -e PORT=3000 \
    remote-config-grpc-server:1.0
```

### Resources
```
https://stackoverflow.com/questions/43911793/cannot-connect-to-go-grpc-server-running-in-local-docker-container
```


```
rm public.pub private
node generate_keys.js -u public.pub -r private -p pass19
node set_config.js -u public.pub -r private -p pass19 -n ns19 -k key19 -v value19
node get_config.js -r private -p pass19 -n ns19 -k key19
```