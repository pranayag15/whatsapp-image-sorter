// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#copyObject-property
var AWS = require('aws-sdk');
require('dotenv').config()

const config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})
const s3 = new AWS.S3();

let params = {
    Bucket: `${process.env.S3_BUCKET}`,
    Key: "/demo/joshua-earle-EqztQX9btrE-unsplash.jpg"
};
s3.deleteObject(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data, "deleted");           // successful response
    
});