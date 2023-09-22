const s3 = require('../config/s3Config');
const { createLog } = require('./imageLogController');
const { v4: uuidv4 } = require('uuid');
const url = require('url');  
const axios = require('axios');
const FormData = require('form-data');

const uploadFile = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(411).json({ error: 'No files uploaded' });
        }

        const uploadedFiles = [];
        const predictions = [];

        for (let file of req.files) {
            const uniqueFileName = uuidv4() + "-" + file.originalname;

            const params = {
                Bucket: 'imagebucket-test1',
                Key: uniqueFileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            const data = await s3.upload(params).promise();
            uploadedFiles.push(data.Location);

            const formData = new FormData();
            formData.append('file', file.buffer, file.originalname);

            const response = await axios.post('http://localhost:8000/api/predict/', formData, {
                headers: formData.getHeaders(),
            });

            predictions.push(response.data);

            // Create a log entry
            createLog(file.originalname, data.Location, req.user);
        }
        console.log("Predictions:", predictions);
        res.status(200).json({ message: 'Files uploaded successfully', files: uploadedFiles, predictions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getFile = (req, res) => {

    const imageNames = req.query.imageNames.split(','); // Assuming you send image names comma-separated

    if (!imageNames || imageNames.length === 0) {
        return res.status(400).json({ error: 'No image names provided' });
    }
    
    const urls = [];
    const errors = [];

    console.log("Image names:", imageNames);
    
    imageNames.forEach(imageName => {

        const parsedUrl = url.parse(imageName, true);
        const key = parsedUrl.pathname.split('/').pop();
        const params = {
            Bucket: 'imagebucket-test1',
            Key: key,
            Expires: 60 * 5
        };
    
        s3.getSignedUrl('getObject', params, (err, url) => {
            if (err) {
                console.error("S3 Get Error:", err);
                errors.push(`Error getting ${key} from S3: ${err.message}`);
            } else {
                urls.push(url);
            }
    
            // Check if we've processed all images
            if (urls.length + errors.length === imageNames.length) {
                if (errors.length > 0) {
                    return res.status(500).json({ errors });
                }
                res.json({ urls });
                console.log("URLs:", urls);
            }
        });
    });
}

module.exports = { uploadFile, getFile };