import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Referral from "@/lib/models/Referral";
import Affiliate from "@/lib/models/Affiliate";

export async function POST(request: Request) {
  try {
    const { affiliateCode, productId, type } = await request.json();
    
    if (!affiliateCode) return NextResponse.json({ error: "Missing ref code" }, { status: 400 });

    await connectDB();
    
    // Check if affiliate exists and is active
    const affiliate = await Affiliate.findOne({ code: affiliateCode, isActive: true });
    if (!affiliate) return NextResponse.json({ error: "Invalid affiliate" }, { status: 404 });

    // Create referral log
    await Referral.create({
      affiliateCode,
      productId,
      type: type || 'click',
      amount: 0,
      commission: 0
    });

    // Update affiliate stats
    await Affiliate.updateOne(
      { code: affiliateCode },
      { $inc: { totalClicks: 1 } }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Referral click error:", error);
    return NextResponse.json({ success: false, error: "Referral tracking failed" }, { status: 200 });
  }
}
