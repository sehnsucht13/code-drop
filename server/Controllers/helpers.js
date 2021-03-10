const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");

// Check if a string is a valid integer.
const isInt = (num) =>
  !Number.isNaN(num) && parseInt(+num, 10) === +num && +num >= 0;

const BUCKETNAME = process.env.AWS_BUCKET_NAME;
const REGION = process.env.AWS_REGION;
const KEY = process.env.AWS_KEY;
const SECRET = process.env.AWS_SECRET;

const s3Instance = new S3({
  region: REGION,
  accessKeyId: KEY,
  secretAccessKey: SECRET,
});

function uploadFile(filepath, filename) {
  const fileStream = fs.createReadStream(filepath);

  const uploadParams = {
    Bucket: BUCKETNAME,
    Body: fileStream,
    Key: filename,
  };
  return s3Instance.upload(uploadParams).promise();
}

function deleteFile(objectKey) {
  const deleteParams = {
    Bucket: BUCKETNAME,
    Key: objectKey,
  };
  return s3Instance.deleteObject(deleteParams).promise();
}

module.exports = {
  isInt,
  uploadFile,
  deleteFile,
};
