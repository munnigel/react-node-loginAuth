const express = require('express');
const router = express.Router();
const resetPasswordController = require('../controllers/resetPasswordController');

router.post('/', resetPasswordController.forgotPassword);
router.post('/reset', resetPasswordController.resetPassword);

module.exports = router;