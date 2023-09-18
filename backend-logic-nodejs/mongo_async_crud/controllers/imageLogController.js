const ImageLog = require('../model/ImageLog');

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
        const logs = await ImageLog.find();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching logs' });
    }
};

module.exports = { createLog, getAllLogs };
