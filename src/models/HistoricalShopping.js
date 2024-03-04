import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const historicalShopSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  shippingAddress: { type: String, required: true },
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Figure' },
    figureName: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true }
}, { timestamps: true });

export default model('HistoricalShopping', historicalShopSchema);
