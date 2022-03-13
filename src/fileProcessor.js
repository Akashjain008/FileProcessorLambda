const BasicUtility = require('./utility');
const DBOpearations = require('./dbOperation');
const S3Operations = require('./s3Operation');
const Config = require('./config/appConfig');
const appConfig = Config.getConfig();

class FileProcessor {

    async processMessage(reqBody, context, source, receiptHandle, receiveCount) {
        try {
            console.log('processMessage: ', JSON.stringify(reqBody));

            const s3File = await S3Operations.getS3Object(reqBody.customName);
            const header = await BasicUtility.getFileHeader(s3File.Body);

            if (!(header && header.toLowerCase().includes(appConfig.PORTABLE_EXECUTABLE_HEADER))) {
                console.info('File is not portable executable');
                return receiptHandle;
            }

            const fileBuffer = s3File.Body.toString('utf-8');
            const fileHash = await BasicUtility.calculateFileHash(fileBuffer);

            reqBody.hash = fileHash;
            reqBody.hashAlgo = appConfig.HASH_ALGO;
            let isExists = await DBOpearations.checkItemExists(reqBody);

            if (isExists) {
                console.log('File already exists.');
                return receiptHandle;
            }

            await S3Operations.copyS3Object(reqBody.customName);

            reqBody.filePath = `${appConfig.FILE_BUCKET_URL}${reqBody.customName}`
            await DBOpearations.saveFileDetails(reqBody);

            return receiptHandle;

        } catch (err) {
            console.error('Error: processMessage', JSON.stringify(err));
            return receiptHandle;
        }

    }
}

module.exports = new FileProcessor();