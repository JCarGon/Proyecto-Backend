import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  rol: { type: String, default: 'user' },
  name: { type: String, required: true },
  address: { type: String, required: true },
  cp: { type: Number, required: true },
  city: { type: String, required: true },
  tlf: { type: String, required: true },
  favouritesFigures: [{ type: Schema.Types.ObjectId, ref: 'Figure' }]
}, { timestamps: true });

export default model('User', userSchema);
