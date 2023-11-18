import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true
    },
    email: {
      type: String,
      require: true,
      max: 50,
      unique: true
    },
    password: {
      type: String,
      require: true,
      min: 6
    }
  },
  { timestamps: true }
);

const UserSchema = mongoose.model('User', User);

export default UserSchema;
