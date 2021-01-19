// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#copyObject-property
var AWS = require('aws-sdk');

require('dotenv').config()

const bucket = process.env.S3_BUCKET // the bucketname without s3://
const PHOTO = 'wp2732752-suits-wallpapers.jpg' // the name of file

const config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

const s3 = new AWS.S3();

var params = {
    Bucket: `${process.env.S3_BUCKET}/filtered`,
    CopySource: `${process.env.S3_BUCKET}/demo/${PHOTO}`,
    Key: `${PHOTO}`
};
s3.copyObject(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
        console.log(data);
        let params = {
            Bucket: `${process.env.S3_BUCKET}/demo`,
            Key: `${PHOTO}`
        };
        s3.deleteObject(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data, "deleted");           // successful response
            
        });
    }
});