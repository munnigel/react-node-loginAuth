const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileUploadController = require('../controllers/imageController');
const imageLogController = require('../controllers/imageLogController');
const verifyJWT = require('../middleware/verifyJWT');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Check the file type
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype) {
            return cb(null, true);
        } else {
            cb('Error: File upload only supports the following filetypes - ' + filetypes);
        }
    }
});


router.post('/upload', upload.array('file'), verifyJWT, fileUploadController.uploadFile);
router.get('/', fileUploadController.getFile);
router.post('/logs', verifyJWT, imageLogController.getAllLogs)

module.exports = router;
