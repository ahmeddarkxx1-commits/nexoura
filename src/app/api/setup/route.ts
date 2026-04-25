import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

// WARNING: In a real app, you should secure this endpoint or remove it after first use.
export async function GET() {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: "ahmed@nexoura.com" });
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin user already exists" });
    }

    const hashedPassword = await bcrypt.hash("NexouraAdmin2026!", 10);
    
    await User.create({
      name: "Super Admin",
      email: "ahmed@nexoura.com",
      password: hashedPassword,
      role: "admin"
    });

    return NextResponse.json({ message: "Admin user created successfully. Email: ahmed@nexoura.com, Password: NexouraAdmin2026!" });
  } catch (error) {
    console.error("Setup API Error:", error);
    return NextResponse.json({ error: "Error creating admin user" }, { status: 500 });
  }
}
