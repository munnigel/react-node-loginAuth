const s3 = require('../config/s3Config');
const File = require('../model/ImageData');
const { createLog } = require('./imageLogController');

const uploadFile = (req, res) => {

    if (!req.file) {
        return res.status(411).json({ error: 'No file uploaded' });
    }
    // Assuming you're using something like multer for file handling
    const file = req?.file
    const params = {
        Bucket: 'imagebucket-test1',
        Key: `${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error("S3 Upload Error:", err); 
            return res.status(500).json({ error: 'Error uploading to S3' });
        }

        // Use the S3 URL as the image reference
        const imageReference = data.Location;

        const newFile = new File({
            url: data.Location,
            imageReference: imageReference
        });

        newFile.save((err, savedFile) => {
            if (err) {
                return res.status(500).json({ error: 'Error saving to MongoDB' });
            }
            res.json({ message: 'Successfully uploaded and saved!', file: savedFile });
        });

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