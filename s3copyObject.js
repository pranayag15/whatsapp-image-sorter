// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#copyObject-property
const colors = require('colors');
require('dotenv').config()


const copyAndDelete = (AWS, fileName) => {
    const s3 = new AWS.S3();
    const PHOTO = fileName

    return new Promise((resolve, reject) => {
        let params = {
            Bucket: `${process.env.S3_BUCKET}/filtered`,
            CopySource: `${process.env.S3_BUCKET}/${process.env.INITIAL_FOLDER}/${PHOTO}`,
            Key: `${PHOTO}`,
            ACL: 'public-read',
        };
        s3.copyObject(params, function (err, data) {
            if (err) reject(err); // an error occurred
            else {
                console.log(colors.yellow(data.CopyObjectResult.ETag, "object moved"));
                let params = {
                    Bucket: `${process.env.S3_BUCKET}/${process.env.INITIAL_FOLDER}`,
                    Key: `${PHOTO}`
                };
                s3.deleteObject(params, function (err, data) {
                    if (err) reject(err); // an error occurred
                    else {
                        // console.log(data, "deleted")
                        resolve(data)
                    }; 
                });
            }
        });
    })
}

module.exports = copyAndDelete;