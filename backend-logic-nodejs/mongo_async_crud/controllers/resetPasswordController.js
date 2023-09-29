const User = require('./../model/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email)

  // Find user by email
  const user = await User.findOne({ username: email });
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetTokenExpiration = Date.now() + 3600000; // 1 hour

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetTokenExpiration;
  await user.save();

  // Send email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.TRANSPORTER_EMAIL,
      pass: process.env.TRANSPORTER_PASSWORD,
    },
  });

  const mailOptions = {
    to: user.username,
    from: 'passwordreset@demo.com',
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://localhost:3000/reset/${resetToken}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err)
      return res.status(500).send({ message: 'Error sending email' });
    }
    res.status(200).send({ message: 'Reset link sent to email' });
  });
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // Find user by token and ensure token hasn't expired
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).send({ message: 'Invalid or expired token' });
  }

  // Hash new password and update user's password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.send({ message: 'Password reset successfully' });
};

module.exports = { forgotPassword, resetPassword };