import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Visit from "@/lib/models/Visit";
import Referral from "@/lib/models/Referral";
import Affiliate from "@/lib/models/Affiliate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLocal } from "@/lib/jsonStorage";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    
    const totalVisits = await Visit.countDocuments();
    const uniqueVisitors = await Visit.distinct('ipHash').then(res => res.length);
    const totalAffiliates = await Affiliate.countDocuments();
    const totalWhatsAppLeads = await Referral.countDocuments({ type: 'whatsapp' });
    
    const topAffiliates = await Affiliate.find({})
      .sort({ totalClicks: -1 })
      .limit(5);

    const recentVisits = await Visit.find({})
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      totalVisits,
      uniqueVisitors,
      totalAffiliates,
      totalWhatsAppLeads,
      topAffiliates,
      recentVisits
    });
  } catch (error: any) {
    console.warn("Stats DB fetch failed, falling back to local storage");
    const localProducts = await getLocal('products');
    const localOrders = await getLocal('orders');
    
    return NextResponse.json({
      totalVisits: 0,
      uniqueVisitors: 0,
      totalAffiliates: 0,
      totalWhatsAppLeads: 0,
      topAffiliates: [],
      recentVisits: [],
      localProductCount: localProducts.length,
      localOrderCount: localOrders.length
    });
  }
}
