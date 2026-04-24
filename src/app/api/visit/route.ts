import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Visit from "@/lib/models/Visit";
import { createHash } from "crypto";

export async function POST(request: Request) {
  try {
    const { path, refCode, userAgent } = await request.json();
    
    // Get IP from headers
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";
    
    // Hash IP for privacy
    const ipHash = createHash("sha256").update(ip).digest("hex");

    await connectDB();
    
    await Visit.create({
      ipHash,
      path,
      refCode,
      userAgent
    });

    return NextResponse.json({ success: true }); // Silent fail to avoid 500 errors in console
  } catch (error: any) {
    console.error("Visit tracking error:", error);
    return NextResponse.json({ success: false, error: "Tracking failed" }, { status: 200 });
  }
}
