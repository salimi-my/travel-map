import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

import User from '../models/User.js';

dotenv.config();

const router = express.Router();

// register
router.post('/register', async (req, res) => {
  try {
    // generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    // save user and send response
    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (err) {
    res.status(500).json(err);
  }
});

//generate access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id, username: user.username },
    process.env.SECRET_KEY,
    {
      expiresIn: '1d'
    }
  );
};

// login
router.post('/login', async (req, res) => {
  try {
    //find user
    const user = await User.findOne({ username: req.body.username });

    if (user) {
      //if user found
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (validPassword) {
        //generate an access token
        const accessToken = generateAccessToken(user);

        res.status(200).json({ username: user.username, accessToken });
      } else {
        res.status(400).json('Incorrect username or password');
      }
    } else {
      //if user not found
      res.status(400).json('Incorrect username or password');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
