import mongoose from 'mongoose';
import Counter from "./Counter.js";

const quotationSchema = new mongoose.Schema({
  // numeric, auto-incrementing ID (keeps default _id ObjectId as well)
  quotationId: { type: Number, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to auto-increment quotationId
quotationSchema.pre('save', async function (next) {
  try {
    if (this.quotationId == null) {
      const counter = await Counter.findOneAndUpdate(
        { id: 'quotationId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.quotationId = counter.seq;
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Virtual: formatted quotation number, e.g. Q-00001
quotationSchema.virtual('quotationNumber').get(function() {
  if (this.quotationId == null) return null;
  return `Q-${String(this.quotationId).padStart(5, '0')}`;
});

// Ensure virtuals are included when converting to JSON / Object
quotationSchema.set('toJSON', { virtuals: true });
quotationSchema.set('toObject', { virtuals: true });

export default mongoose.model('Quotation', quotationSchema);