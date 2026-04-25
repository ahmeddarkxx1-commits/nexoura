
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found');
  process.exit(1);
}

// Define Schemas inline to avoid import issues in standalone script
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  finalPrice: { type: Number },
  category: { type: String, required: true },
  images: [{ type: String }],
  techStack: [{ type: String }],
  features: [{ type: String }],
  useCase: { type: String },
  liveDemo: { type: String, default: "#" },
  accentColor: { type: String, default: "#0077b6" },
  gradient: { type: String, default: "from-blue-600/20 to-cyan-600/20" },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  features: [{ type: String }],
  isPopular: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  buttonText: { type: String, default: 'Get Started' },
  description: { type: String },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Plan = mongoose.models.Plan || mongoose.model('Plan', PlanSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Add Products
    const products = [
      {
        title: "AquaCRM Pro",
        description: "A high-performance CRM for marine and aquatic businesses. Manage clients, bookings, and inventory with ease.",
        price: 799,
        discount: 25,
        category: "Corporate",
        techStack: ["Next.js", "MongoDB", "Tailwind"],
        features: ["Client Management", "Automated Bookings", "Inventory Tracking", "Analytics Dashboard"],
        useCase: "Ideal for yacht charters, diving schools, and marine logistics.",
        accentColor: "#0077b6",
        gradient: "from-blue-600/20 to-cyan-600/20",
        isFeatured: true
      },
      {
        title: "LuxeOcean E-commerce",
        description: "A premium storefront for luxury aquatic goods. Optimized for high conversion and visual storytelling.",
        price: 1200,
        discount: 10,
        category: "E-commerce",
        techStack: ["Next.js", "Stripe", "Clerk"],
        features: ["One-click Checkout", "AI Product Suggestions", "Global Shipping Calc", "Premium UI"],
        useCase: "Perfect for luxury watch brands, high-end swimwear, and premium equipment.",
        accentColor: "#00b4d8",
        gradient: "from-cyan-600/20 to-blue-600/20"
      },
      {
        title: "Marine Portfolio",
        description: "A cinematic portfolio template for underwater photographers and marine researchers.",
        price: 349,
        discount: 0,
        category: "Landing Page",
        techStack: ["React", "Framer Motion", "Three.js"],
        features: ["3D Gallery", "Immersive Scroll", "WhatsApp Contact", "Full SEO"],
        useCase: "Designed for artists, researchers, and professional divers.",
        accentColor: "#00d4ff",
        gradient: "from-blue-500/20 to-cyan-500/20"
      }
    ];

    for (const p of products) {
      const finalPrice = p.price - (p.price * (p.discount / 100));
      await Product.create({ ...p, finalPrice });
    }
    console.log('Added 3 products');

    // Add Plans
    const plans = [
      {
        name: "Shoreline",
        price: 199,
        description: "Basic landing page and essential tools to get you started.",
        features: ["1 Landing Page", "Basic SEO", "WhatsApp Integration", "1 Month Support"],
        isPopular: false
      },
      {
        name: "TideMaster",
        price: 599,
        description: "Full business platform with advanced features and customization.",
        features: ["3-5 Pages", "Advanced SEO", "Custom Branding", "3 Months Support", "Analytics Integration"],
        isPopular: true
      },
      {
        name: "DeepOcean",
        price: 1499,
        description: "Custom enterprise solutions with unlimited possibilities.",
        features: ["Unlimited Pages", "Custom Dashboard", "Full E-commerce", "Priority Support", "Hosting Included"],
        isPopular: false
      }
    ];

    await Plan.create(plans);
    console.log('Added 3 plans');

    await mongoose.disconnect();
    console.log('Seeding complete');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
