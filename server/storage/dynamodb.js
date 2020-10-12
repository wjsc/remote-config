const AWS = require('aws-sdk');

const set = (client, TableName) => (namespace, key, value) => {
    return new Promise( (resolve, reject) => {
        client.put({
            TableName,
            Item:{
                namespace,
                key,
                value
            }
        }, (err, data) => {
            err ? reject(err) : resolve({ namespace, key })
        });
    })
}

const get = (client, TableName) => (namespace, key) => {
    return new Promise( (resolve, reject) => {
        client.get({
            TableName,
            Item:{
                namespace,
                key
            }
        }, (err, data) => {
            err ? reject(err) : resolve(data)
        });
    })
}

const del = (client, TableName) => (namespace, key) => {
    return new Promise( (resolve, reject) => {
        client.delete({
            TableName,
            Item:{
                namespace,
                key
            }
        }, (err, data) => {
            err ? reject(err) : resolve({})
        });
    })
}

const createTable = (dynamodb, TableName, ReadCapacityUnits, WriteCapacityUnits) => {
    return new Promise( (resolve, reject) => {
        const params = {
            TableName,
            KeySchema: [       
                { AttributeName: "namespace", KeyType: "HASH"},
                { AttributeName: "key", KeyType: "HASH" }
            ],
            AttributeDefinitions: [       
                { AttributeName: "namespace", AttributeType: "S" },
                { AttributeName: "key", AttributeType: "S" },
                { AttributeName: "value", AttributeType: "S" }
            ],
            ProvisionedThroughput: {       
                ReadCapacityUnits, 
                WriteCapacityUnits
            }
        };
    
        dynamodb.createTable(params, (err, data) => {
            err ? reject(err) : resolve(data)
        });
    })
};

const init = async (region, endpoint, accessKeyId, secretAccessKey, TableName, ReadCapacityUnits, WriteCapacityUnits) => {
    const config = {};
    
    if(region) config.region = region;
    if(endpoint) config.endpoint = endpoint;
    if(accessKeyId) config.accessKeyId = accessKeyId;
    if(secretAccessKey) config.secretAccessKey = secretAccessKey;

    AWS.config.update(config);
    const dynamodb = new AWS.DynamoDB();
    const client = new AWS.DynamoDB.DocumentClient({ service: dynamodb });
    try{
        await createTable(dynamodb, TableName, ReadCapacityUnits, WriteCapacityUnits);
    }
    catch(err){
        if(err.code !== 'ResourceInUseException') throw err;
    }
    return {
        get: get(client, TableName),
        set: set(client, TableName),
        del: del(client, TableName)
    }
}

module.exports = { 
    init
};
