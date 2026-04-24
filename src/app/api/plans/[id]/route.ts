import { NextResponse } from "next/server"; 
import connectDB from "@/lib/db";
import Plan from "@/lib/models/Plan";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getLocal, updateLocal, deleteLocal } from "../../../../lib/jsonStorage";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const plan = await Plan.findById(id);
    if (!plan) throw new Error("Not found in DB");
    return NextResponse.json(plan);
  } catch (error) {
    const localPlans = await getLocal('plans');
    const plan = localPlans.find((p: any) => p._id === id);
    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    return NextResponse.json(plan);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    try {
      await connectDB();
      const plan = await Plan.findByIdAndUpdate(id, body, { new: true });
      if (plan) return NextResponse.json({ success: true, plan });
    } catch (dbError) {
      // Fallback to local
      await updateLocal('plans', id, body);
      return NextResponse.json({ success: true, message: "Updated in local storage" });
    }
    
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
      await connectDB();
      await Plan.findByIdAndDelete(id);
    } catch (dbError) {
      await deleteLocal('plans', id);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
