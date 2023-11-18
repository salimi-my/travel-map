import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import cors from 'cors';

import userRoute from './routes/users.js';
import pinRoute from './routes/pins.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('MongoDB connected!');
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/api/users', userRoute);
app.use('/api/pins', pinRoute);

const startServer = async () => {
  try {
    app.listen(3001, () => console.log('Server has started on port 3001!'));
  } catch (error) {
    console.log(error);
  }
};

startServer();
