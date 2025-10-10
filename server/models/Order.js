import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Customer name is required'] },
  email: { type: String, required: [true, 'Email is required'] },
  phone: { type: String, required: [true, 'Phone is required'] },
  item: { type: String, required: [true, 'Item name is required'] },
  quantity: { type: Number, required: [true, 'Quantity is required'], min: [1, 'Minimum quantity is 1'] },
  amount: { type: Number, required: [true, 'Amount is required'], min: [0, 'Amount cannot be negative'] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);