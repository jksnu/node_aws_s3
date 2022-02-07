const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const app = express();
const upload = multer();
dotenv.config({
  path: path.join(__dirname, './.env')
});

app.listen(8000);

//Creating routes
//uploading file to s3
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await s3.putObject({
      Body: req.file.buffer,
      Bucket: process.env.BUCKET_NAME,
      Key: req.file.originalname
    }).promise();
    res.send(result);
  } catch (error) {
    console.log(error);
    throw error;
  }  
});

//Listing uploaded files
app.get('/fileList', async(req, res) => {
  try {
    const result = await s3.listObjectsV2({
      Bucket: process.env.BUCKET_NAME
    }).promise();
    res.send(result);
  } catch (error) {
    console.log(error);
    throw error;
  }
});

//Deleting a file
app.delete('/deleteFile/:fileName', async(req, res) => {
  try {
    const fileName = req.params.fileName;
    const result = await s3.deleteObject({
      Bucket: process.env.BUCKET_NAME,
      Key: fileName
    }).promise();
    res.send(result);
  } catch (error) {
    console.log(error);
    throw error;
  }
})

//Download a file
app.get('/downloadFile/:fileName', async(req, res) => {
  try {
    const fileName = req.params.fileName;
    const result = await s3.getObject({
      Bucket: process.env.BUCKET_NAME,
      Key: fileName
    }).promise();
    res.send(result.Body);
  } catch (error) {
    console.log(error);
    throw error;
  }
})


