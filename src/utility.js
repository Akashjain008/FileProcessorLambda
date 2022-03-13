
const CryptoJS = require('crypto-js');

class BasicUtility {
    async calculateFileHash(fileBuffer) {
        try {
            const fileHash = await CryptoJS.MD5(fileBuffer).toString();
            console.log('calculateFileHash: ', fileHash);
            return fileHash;
        } catch (err) {
            console.error('Error: calculateFileHash', err);
            throw err;
        }
    };
    async getFileHeader(s3FileBody) {
        try {
            const arr = (new Uint8Array(s3FileBody)).subarray(0, 4);
            let header = ''
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            console.log('getFileHeader: ', header);
            return header;
        } catch (err) {
            console.error('Error: getFileHeader', err);
            throw err;
        }
    };
}

module.exports = new BasicUtility();