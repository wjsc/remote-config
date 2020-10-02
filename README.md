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
node generate_keys.js -u public.pub -r private -p hello-world
node save_config.js -u public.pub -r private -p hello-world -n ns -k key -v hello-world!
node save_config.js -u public.pub -r private -p hello-world -n ns -k key2 -v Hola-mundo!
```