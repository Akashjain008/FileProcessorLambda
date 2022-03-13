const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const FileProcessor = require('./fileProcessor');
const Config = require('./config/appConfig');
const appConfig = Config.getConfig();

class ProcessSqsMessage {
    async processSqsMessage(events, context, source) {
        if (events.length === 0) {
            return [];
        } else {
            let promises = [];
            events.Records.forEach(async (record) => {
                let receiveCount = record.attributes.ApproximateReceiveCount;
                if (record['body']) {
                    promises.push(
                        FileProcessor.processMessage(
                            JSON.parse(record['body']),
                            context,
                            source,
                            record['receiptHandle'],
                            receiveCount
                        )
                    )
                }

            }, this);

            return Promise.all(promises)
                .then((receiptHandlers) => {
                    if (receiptHandlers && receiptHandlers.length === 0) {
                        return true;
                    } else {
                        let receiptHandlerParamsArray = [];
                        for (let receiptHandlerIter in receiptHandlers) {
                            receiptHandlerParamsArray.push({
                                Id: receiptHandlerIter,
                                ReceiptHandle: receiptHandlers[receiptHandlerIter]
                            });
                        }
                        let params = {
                            QueueUrl: appConfig.QUEUE_URL,
                            Entries: receiptHandlerParamsArray
                        };
                        return sqs.deleteMessageBatch(params)
                            .promise()
                            .then((data) => {
                                return true;
                            })
                            .catch((error) => {
                                throw new Error(error);
                            });

                    }
                });
        }
    }
}

module.exports = new ProcessSqsMessage();