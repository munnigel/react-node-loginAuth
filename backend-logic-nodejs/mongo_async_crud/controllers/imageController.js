const s3 = require('../config/s3Config');
const { createLog } = require('./imageLogController');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (req, res) => {

    if (!req.file) {
        return res.status(411).json({ error: 'No file uploaded' });
    }
    // Assuming you're using something like multer for file handling
    const file = req?.file
    const uniqueFileName = `${uuidv4()}-${file.originalname}`;
    const params = {
        Bucket: 'imagebucket-test1',
        Key: uniqueFileName,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error("S3 Upload Error:", err); 
            return res.status(500).json({ error: 'Error uploading to S3' });
        }
        res.status(200).send({ ...data, uniqueFileName });

        // Create a log entry
        createLog(file.originalname, data.Location, req.user);
    });
};

const getFile = (req, res) => {
    const imageName = req.params.imageName;

    const params = {
        Bucket: 'imagebucket-test1',
        Key: imageName,
        Expires: 60 * 5
    };

    s3.getSignedUrl('getObject', params, (err, url) => {
        if (err) {
            console.error("S3 Get Error:", err);
            return res.status(500).json({ error: 'Error getting from S3' });
        }
        res.json({ url });
    });

    
}

module.exports = { uploadFile, getFile };