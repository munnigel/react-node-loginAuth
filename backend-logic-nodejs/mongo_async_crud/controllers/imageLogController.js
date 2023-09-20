const ImageLog = require('../model/ImageLog');
const s3 = require('../config/s3Config');
const url = require('url');

// Function to create a new log entry
const createLog = async (imageName, imageUrl, username) => {
    const newLog = new ImageLog({
        imageName: imageName,
        imageUrl: imageUrl,
        username: username
    });

    try {
        await newLog.save();
        console.log("Log entry created successfully!");
    } catch (error) {
        console.error("Error creating log entry:", error);
    }
};

// Function to fetch all log entries (you can add more functions as needed)
const getAllLogs = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }


        const logs = await ImageLog.find({ username });

        // Extract image keys from the logs
        const imageKeys = logs.map(log => {
            const parsedUrl = url.parse(log.imageUrl, true);
            return parsedUrl.pathname.split('/').pop();
        });

        // Generate signed URLs for each image key
        const signedUrls = imageKeys.map(key => {
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: key,
                Expires: 60 * 5 // 5 minutes
            };
            return s3.getSignedUrl('getObject', params);
        });

        // Combine logs with their corresponding signed URLs
        const logsWithUrls = logs.map((log, index) => {
            return {
                ...log._doc,
                signedUrl: signedUrls[index]
            };
        });

        res.json(logsWithUrls);
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ error: 'Error fetching logs' });
    }
};

module.exports = { createLog, getAllLogs };
