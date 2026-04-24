import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  techStack: [{ type: String }],
  features: [{ type: String }],
  useCase: { type: String },
  liveDemo: { type: String, default: "#" },
  accentColor: { type: String, default: "#8b5cf6" },
  gradient: { type: String, default: "from-violet-600/20 to-cyan-600/20" },
  upsells: {
    customization: { type: Number, default: 499 },
    hosting: { type: Number, default: 29 },
    maintenance: { type: Number, default: 99 }
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

// Middleware to calculate finalPrice before saving
ProductSchema.pre('save', function(this: any, next: any) {
  if (this.discount > 0) {
    this.finalPrice = this.price - (this.price * (this.discount / 100));
  } else {
    this.finalPrice = this.price;
  }
  next();
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
