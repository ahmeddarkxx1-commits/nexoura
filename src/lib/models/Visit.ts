import mongoose from 'mongoose';

const VisitSchema = new mongoose.Schema({
  ipHash: { type: String, required: true, index: true },
  refCode: { type: String, index: true },
  path: { type: String, required: true },
  userAgent: { type: String },
}, { timestamps: true });

export default mongoose.models.Visit || mongoose.model('Visit', VisitSchema);
