import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Plan from "@/lib/models/Plan";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { saveLocal, getLocal } from "@/lib/jsonStorage";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const plan = await Plan.create(body);
    return NextResponse.json({ success: true, plan }, { status: 201 });
  } catch (error: any) {
    console.error("API POST Plan Error:", error);
    if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
      try {
        const body = await request.json();
        const plan = await saveLocal('plans', body);
        return NextResponse.json({ success: true, plan, storage: 'local' }, { status: 201 });
      } catch (e) {
        return NextResponse.json({ error: "Storage failure" }, { status: 500 });
      }
    }
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const onlyActive = searchParams.get('active') === 'true';
    
    const query = onlyActive ? { isActive: true } : {};
    const plans = await Plan.find(query).sort({ price: 1 });
    
    return NextResponse.json(plans);
  } catch (error: any) {
    console.error("API GET Plans Error:", error);
    // Return local data if DB is unreachable
    const localData = await getLocal('plans');
    return NextResponse.json(localData);
  }
}
