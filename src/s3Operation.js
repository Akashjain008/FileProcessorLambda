const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const Config = require('./config/appConfig');
const appConfig = Config.getConfig();

class S3Operations {
    async getS3Object(fileName) {
        try {
            const getFileParams = {
                Bucket: appConfig.ALL_FILE_BUCKET,
                Key: fileName,
            }
            const s3File = await s3.getObject(getFileParams).promise();
            console.log('getS3Object: ', JSON.stringify(s3File));
            return s3File;
        } catch (err) {
            console.error('Error: getS3Object', err);
            throw err;
        }
    };
    async copyS3Object(fileName) {
        try {
            const params = {
                Bucket: appConfig.PE_FILE_BUCKET,
                CopySource: `${appConfig.ALL_FILE_BUCKET}/${fileName}`,
                Key: fileName
            };
            let result = await s3.copyObject(params).promise();
            console.log('copyS3Object:', JSON.stringify(result));
            return result;
        } catch (err) {
            console.error('Error: copyS3Object', err);
            throw err;
        }
    };
}

module.exports = new S3Operations();
