const MongoClient = require('mongodb').MongoClient;

const set = collection => (namespace, key, value) => {
    return new Promise( (resolve, reject) => {
        collection.insertOne({ namespace, key, value }, (err, _) =>{
            err ? reject(err) : resolve({ namespace, key })
        });
    })
}

const get = collection => (namespace, key) => {
    return new Promise( (resolve, reject) => {
        collection.findOne({ namespace, key }, ( err, result ) => {
            err ? reject(err) : resolve( result )
        });
    })
}

const del = collection => (namespace, key) => {
    return new Promise( (resolve, reject) => {
        collection.deleteOne({ namespace, key }, (err, _ ) =>{
            err ? reject(err) : resolve( {} )
        });
    })
}

const connect = (ip, port, database, collectionName) => {
    return new Promise((resolve, reject)=>{
        MongoClient.connect(`mongodb://${ip}:${port}`, (err, client) => {
            err ? reject(err) : resolve(client.db(database).collection(collectionName));
        });
    });
}

const init = async (ip, port, database, collectionName) => {
    const collection = await connect(ip, port, database, collectionName);
    return {
        set: set(collection),
        get: get(collection),
        del: del(collection)
    }
}

module.exports = { 
    init
};
