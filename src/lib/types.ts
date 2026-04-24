export type Category = "All" | "E-commerce" | "Landing Page" | "Corporate" | "Business" | "Apps";

export interface Project {
  id: string;
  title: string;
  category: Exclude<Category, "All">;
  price: number;
  customPrice: number;
  description: string;
  tags: string[];
  gradient: string;
  accentColor: string;
  features: string[];
  useCase: string;
  liveDemo: string;
  image?: string;
  images?: string[];
  discount?: number;
  finalPrice?: number;
  techStack?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  upsells: {
    customization: number;
    hosting: number;
    maintenance: number;
  };
}

export interface Service {
  name: string;
  price: string;
  tagline: string;
  color: string;
  accentColor: string;
  featured?: boolean;
  features: string[];
  disabled: string[];
  cta: string;
}

export interface Stat {
  label: string;
  value: string;
  suffix: string;
}

export interface Affiliate {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  code: string;
  totalClicks: number;
  totalSales: number;
  totalEarnings: number;
  isActive: boolean;
  createdAt?: string;
}

export interface Referral {
  id?: string;
  affiliateCode: string;
  productId?: string;
  orderId?: string;
  type: 'click' | 'whatsapp' | 'purchase';
  amount: number;
  commission: number;
  createdAt?: string;
}

export interface Visit {
  id?: string;
  ipHash: string;
  refCode?: string;
  path: string;
  userAgent?: string;
  createdAt?: string;
}
