import mongoose from 'mongoose';

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  features: [{ type: String }],
  isPopular: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  buttonText: { type: String, default: 'Get Started' },
  description: { type: String },
}, { timestamps: true });

export default mongoose.models.Plan || mongoose.model('Plan', PlanSchema);
