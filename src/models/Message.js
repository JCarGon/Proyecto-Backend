import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const message = new Schema({
  name: { type: String, required: true },
  surnames: { type: String, required: true },
  email: { type: String, required: true },
  tlf: { type: String, required: true },
  msg: { type: String, required: true }
}, { timestamps: true });

export default model('Message', message);
