import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Affiliate from "@/lib/models/Affiliate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateLocal, deleteLocal } from "@/lib/jsonStorage";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  try {
    await connectDB();
    const updated = await Affiliate.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated);
  } catch (error: any) {
    console.warn("Affiliate DB update failed, falling back to local storage");
    await updateLocal('affiliates', id, body);
    return NextResponse.json({ ...body, _id: id, status: 'local' });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await connectDB();
    await Affiliate.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.warn("Affiliate DB delete failed, falling back to local storage");
    await deleteLocal('affiliates', id);
    return NextResponse.json({ success: true, status: 'local' });
  }
}
