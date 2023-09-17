const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'ap-southeast-1' // e.g., 'us-west-1'
});

const s3 = new AWS.S3();

module.exports = s3;