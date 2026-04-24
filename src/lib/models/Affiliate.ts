import mongoose from 'mongoose';

const AffiliateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  totalClicks: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Affiliate || mongoose.model('Affiliate', AffiliateSchema);
