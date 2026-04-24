import mongoose from 'mongoose';

const ReferralSchema = new mongoose.Schema({
  affiliateCode: { type: String, required: true, index: true },
  productId: { type: String, index: true },
  orderId: { type: String },
  type: { type: String, enum: ['click', 'whatsapp', 'purchase'], required: true },
  amount: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Referral || mongoose.model('Referral', ReferralSchema);
