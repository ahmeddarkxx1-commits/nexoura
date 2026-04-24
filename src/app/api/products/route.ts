import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";
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
    
    // finalPrice is handled by pre-save middleware, but we can double check here
    if (body.discount > 0) {
      body.finalPrice = body.price - (body.price * (body.discount / 100));
    } else {
      body.finalPrice = body.price;
    }

    const product = await Product.create(body);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    
    // Fallback to local storage if DB is unreachable
    if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
      try {
        const body = await request.json();
        const product = await saveLocal('products', body);
        return NextResponse.json({ success: true, product, storage: 'local' }, { status: 201 });
      } catch (localError) {
        return NextResponse.json({ error: "Storage failure" }, { status: 500 });
      }
    }
    
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const onlyActive = searchParams.get('active') === 'true';
    
    const query = onlyActive ? { isActive: true } : {};
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("API GET Products Error:", error);
    // Return local data if DB is unreachable
    const localData = await getLocal('products');
    return NextResponse.json(localData);
  }
}
