const BasicUtility = require('./utility');
const DBOpearations = require('./dbOperation');
const S3Operations = require('./s3Operation');

exports.handler = async (event) => {
    try {
        console.log('requestBody', requestBody.event.Records);
        const event = requestBody.event;
        event.Records.forEach(async (record) => {
            console.log(record.body);
            const reqBody = JSON.parse(JSON.stringify(record.body));
            console.log('reqBody', reqBody);
            console.log('key', reqBody["customName"])
            const s3File = await S3Operations.getS3Object(reqBody.customName);
            const header = await BasicUtility.getFileHeader(s3File.Body);
            console.log('header', header);
            if (!(header && header.toLowerCase().includes('4d5a'))) {
                console.info('File is not portable executable');
                return;
            }
            const fileBuffer = s3File.Body.toString('utf-8');
            const fileHash = await BasicUtility.calculateFileHash(fileBuffer);
            reqBody.hash = fileHash;
            let isExists = await DBOpearations.checkItemExists(reqBody);
            if (isExists) {
                console.log('File already exists.');
                return;
            }
            await S3Operations.copyS3Object(reqBody.customName);
            await DBOpearations.saveFileDetails(reqBody);
        });

    } catch (err) {
        console.log('Error: processRequestService', JSON.stringify(err));
        throw err;
    };
};

