import mongoose from 'mongoose';

export default function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/login';
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}