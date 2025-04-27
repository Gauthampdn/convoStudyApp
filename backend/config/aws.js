const AWS = require('aws-sdk');

// initialize AWS SDK with env variables
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3(); // create instance for S3 

module.exports = s3;
