import mongoose from 'mongoose';

const passwordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  website: { type: String, required: true },
  username: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
  category: { type: String, default: 'Personal' },
}, { timestamps: true });

export default mongoose.model('Password', passwordSchema);

