const ProcessSqsMessage = require('./processSqsMessage');

exports.handler = async (event, context) => {
    try {
        console.log('File processor hanlder ', JSON.stringify(event));
        let promises = [];
        if (event.Records && event.Records[0] && event.Records[0].eventSource === 'aws:sqs') {
            promises.push(ProcessSqsMessage.processSqsMessage(event, context, 'SQS'));
            return await Promise.all(promises);

        } else {
            console.log('API support will be available.');
            return;
        }
    } catch (err) {
        console.log('Error: processRequestService', JSON.stringify(err));
        throw err;
    };
};