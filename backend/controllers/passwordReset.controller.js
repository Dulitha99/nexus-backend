import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../models/user.model.js'; 
import dotenv from 'dotenv';

dotenv.config();

console.log('...Email User:', process.env.EMAIL_USER);
console.log('...Email Pass:', process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 587, 
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: "nykbowppushugnnx",
  },
});


const generateKey = () => {
  return crypto.randomBytes(4).toString('hex');
};

export const sendVerificationKey = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const key = generateKey();
    const keyExpires = new Date(Date.now() + 3600000); 
    user.verificationKey = key;
    user.keyExpires = keyExpires;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Verification Key',
      text: `Your verification key is ${key}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to send email' });
      } else {
        return res.json({ success: true, message: 'Verification key sent to your email' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyKey = async (req, res) => {
     const { email,verificationKey} = req.body;
  try {
    const user = await User.findOne({ email });
    console.log("....",user)
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.verificationKey !== verificationKey) {
      return { success: false, message: 'Invalid verification key' };
    }

    if (user.keyExpires < Date.now()) {
      return  { success: false, message: 'Verification key expired' };
    }

    return res.json({ success: true, message: 'Verification key is valid' });
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Server error' };
  }
};

export const resetPassword = async (req, res) => {
  const { email, verificationKey, newPassword } = req.body;
console.log(req.body)
  try {
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.verificationKey !== verificationKey) {
      return res.status(400).json({ success: false, message: 'Invalid verification key' });
    }

    if (user.keyExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Verification key expired' });
    }

   
    user.verificationKey = null;
    user.keyExpires = null;
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
