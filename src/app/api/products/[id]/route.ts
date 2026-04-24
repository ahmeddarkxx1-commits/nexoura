import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLocal, updateLocal, deleteLocal } from "../../../../lib/jsonStorage";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const product = await Product.findById(id);
    if (!product) throw new Error("Not found in DB");
    return NextResponse.json(product);
  } catch (error) {
    const localProducts = await getLocal('products');
    const product = localProducts.find((p: any) => p._id === id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    
    if (body.discount > 0) {
      body.finalPrice = body.price - (body.price * (body.discount / 100));
    } else {
      body.finalPrice = body.price;
    }

    try {
      await connectDB();
      const product = await Product.findByIdAndUpdate(id, body, { new: true });
      if (product) return NextResponse.json({ success: true, product });
    } catch (dbError) {
      await updateLocal('products', id, body);
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
      await Product.findByIdAndDelete(id);
    } catch (dbError) {
      await deleteLocal('products', id);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
