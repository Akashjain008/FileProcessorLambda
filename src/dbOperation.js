const dynamodb = new AWS.DynamoDB();
const { v4: uuidv4 } = require('uuid');

const DBOpearations = {
    saveFileDetails: async (requestBody) => {
        try {
            let params = {
                TableName: 'file-metadata',
                Item: {
                    id: { S: uuidv4() },
                    fileHash: { S: requestBody.hash },
                    name: { S: requestBody.name },
                    size: { S: requestBody.size },
                    type: { S: requestBody.type },
                    customName: { S: requestBody.customName },
                    expiryDate: { S: Date.now().toString() }
                }
            };
            console.log(params);
            const data = await dynamodb.putItem(params).promise();
            console.log('Item added successfully', data);
            return data;
        } catch (err) {
            console.log("Error: ", err);
            throw err;
        }
    },
    checkItemExists: async (requestBody) => {
        try {
            const dynamodb = new AWS.DynamoDB();
            let params = {
                TableName: 'fileTracker',
                Item: {
                    fileHash: { S: requestBody.hash },
                    fileName: { S: requestBody.customName },
                    expiryDate: { S: Date.now().toString() }
                },
                ConditionExpression: 'attribute_not_exists(fileHash)'
            };
            console.log(params);
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
    }
};

export default DBOpearations;

