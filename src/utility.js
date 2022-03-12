
const CryptoJS = require('crypto-js');

const BasicUtility = {
    calculateFileHash: async (fileBuffer) => {
        try {
            const fileHash = await CryptoJS.MD5(fileBuffer).toString();
            return fileHash;
        } catch (err) {
            console.error('Error: calculateFileHash', err);
            throw err;
        }
    },
    getFileHeader: async (s3FileBody) => {
        try {
            const arr = (new Uint8Array(s3FileBody)).subarray(0, 4);
            let header = ''
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            return header;
        } catch (err) {
            console.error('Error: getFileHeader', err);
            throw err;
        }
    }

}

export default BasicUtility;