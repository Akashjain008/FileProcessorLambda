const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const { v4: uuidv4 } = require('uuid');
const Config = require('./config/appConfig');
const appConfig = Config.getConfig();

class DBOpearations {
    async saveFileDetails(requestBody) {
        try {
            let params = {
                TableName: appConfig.FILE_TABLE_NAME,
                Item: {
                    id: { S: uuidv4() },
                    name: { S: requestBody.name },
                    size: { S: requestBody.size.toString() },
                    file_path: { S: requestBody.filePath },
                    file_hash_id: { S: requestBody.hash },
                    mime_type: { S: requestBody.type },
                    custom_name: { S: requestBody.customName },
                    created_at: { S: new Date().toDateString() },
                    expiry_at: { S: Date.now().toString() }
                }
            };
            console.log('saveFileDetails params', params);
            const data = await dynamodb.putItem(params).promise();
            console.log('Item added successfully', data);
            return data;
        } catch (err) {
            console.log("Error: ", err);
            throw err;
        }
    };
    async checkItemExists(requestBody) {
        try {
            const dynamodb = new AWS.DynamoDB();
            let params = {
                TableName: appConfig.HASH_TABLE_NAME,
                Item: {
                    file_hash_id: { S: requestBody.hash },
                    file_name: { S: requestBody.customName },
                    file_hash_algo: { S: requestBody.hashAlgo },
                    created_at: { S: new Date().toDateString() },
                    expiry_at: { S: Date.now().toString() }
                },
                ConditionExpression: 'attribute_not_exists(file_hash_id)'
            };
            console.log('checkItemExists params', params);
            const data = await dynamodb.putItem(params).promise();
            console.log('Item added successfully', data);
            return false;

        } catch (err) {
            if (err && err.code === 'ConditionalCheckFailedException') {
                console.log("Error: ", err.code);
                return true;
            }
            throw err;
        }
    };
};

module.exports = new DBOpearations();

