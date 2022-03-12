const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const S3Operations = {
    getS3Object: async (fileName) => {
        try {
            const getFileParams = {
                Bucket: 'filereceiverbucket',
                Key: fileName,
            }
            const s3File = await s3.getObject(getFileParams).promise();
            return s3File;
        } catch (err) {
            console.error('Error: getS3Object', err);
            throw err;
        }
    },
    copyS3Object: async (fileName) => {
        try {
            const params = {
                Bucket: "portable-executable-file-bucket",
                CopySource: 'filereceiverbucket/' + fileName,
                Key: fileName
            };
            let result = await s3.copyObject(params).promise();
            return result;
        } catch (err) {
            console.error('Error: copyS3Object', err);
            throw err;
        }
    }
};

export default S3Operations;