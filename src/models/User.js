import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, default: 'user' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  cp: { type: Number, required: true },
  city: { type: String, required: true },
  date: { type: String, required: true },
  favouritesFigures: { type: Array , default: [] }
}, { timestamps: true });

export default model('User', userSchema);
