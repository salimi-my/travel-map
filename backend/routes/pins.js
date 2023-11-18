import express from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

import Pin from '../models/Pin.js';

dotenv.config();

const router = express.Router();

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json('Token is not valid!');
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json('You are not authenticated!');
  }
};

// create a pin
router.post('/', verify, async (req, res) => {
  //check token username
  if (req.user.username === req.body.username) {
    const newPin = new Pin(req.body);
    try {
      const savedPin = await newPin.save();
      res.status(200).json(savedPin);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('You are not allowed to add pin for this user!');
  }
});

// get all pins
router.get('/', async (_, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
