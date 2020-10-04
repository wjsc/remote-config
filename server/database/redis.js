const redis = require("redis");

const set = client => (namespace, key, value) => {
    return new Promise( (resolve, reject) => {
        client.hset( namespace, key, value, (err, _) => 
            err ? reject(err) : resolve({ namespace, key })
        );
    })
}

const get = client => (namespace, key) => {
    return new Promise( (resolve, reject) => {
        client.hget( namespace, key, (err, value) => 
            err ? reject(err) : resolve({ namespace, key, value })
        );
    })
}

const del = client => (namespace, key) => {
    return new Promise( (resolve, reject) => {
        client.hdel( namespace, key, (err, _) => 
            err ? reject(err) : resolve({})
        );
    })
}

const init = (...args) => {
    const dbClient = redis.createClient(...args);
    dbClient.on("error", (error) => console.error(error) || process.exit(1));
    return {
        set: set(dbClient),
        get: get(dbClient),
        del: del(dbClient),
    }
}

module.exports = { 
    init
};
