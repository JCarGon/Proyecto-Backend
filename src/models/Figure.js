import mongoose from "mongoose";

const { Schema, model } = mongoose;

const figureSchema = new Schema({
  name: { type: String, required: true, unique: true },
  character: { type: String, required: true },
  company: { type: String, required: true },
  price: { type: Number, required: true },
  dimensions: { type: String, required: true },
  material: { type: String, required: true },
  brand: { type: String, required: true },
  principalImage: { type: String, required: true },
  images: { type: Array, default: [] },
  amount: { type: Number, required: true },
  animeName: { type: String, required: true }
}, { timestamps: true });

export default model('Figure', figureSchema);
