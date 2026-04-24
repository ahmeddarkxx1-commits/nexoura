import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Affiliate from "@/lib/models/Affiliate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getLocal, saveLocal } from "@/lib/jsonStorage";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const affiliates = await Affiliate.find({}).sort({ createdAt: -1 });
    return NextResponse.json(affiliates);
  } catch (error: any) {
    console.warn("Affiliate DB fetch failed, falling back to local storage");
    const localAffiliates = await getLocal('affiliates');
    return NextResponse.json(localAffiliates);
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, email } = await request.json();
    
    // Generate unique code: name + random 4 digits
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    const code = `${cleanName}${random}`;

    try {
      await connectDB();
      const newAffiliate = await Affiliate.create({
        name,
        email,
        code,
        totalClicks: 0,
        totalSales: 0,
        totalEarnings: 0,
        isActive: true
      });
      return NextResponse.json(newAffiliate);
    } catch (dbError) {
      console.warn("Affiliate DB save failed, falling back to local storage");
      const newAffiliate = await saveLocal('affiliates', {
        name,
        email,
        code,
        totalClicks: 0,
        totalSales: 0,
        totalEarnings: 0,
        isActive: true,
        createdAt: new Date().toISOString()
      });
      return NextResponse.json(newAffiliate);
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 200 });
  }
}
