import { notFound } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";
import type { Metadata } from "next";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";
import { getLocal } from "@/lib/jsonStorage";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProject(id: string) {
  try {
    await connectDB();
    // Try finding by ID directly first (handles both ObjectId and custom strings)
    const dbProject = await Product.findOne({ _id: id }).lean();
    if (dbProject) return dbProject;
    
    // Fallback to local if not found in DB
    const localProducts = await getLocal('products');
    return localProducts.find((p: any) => p._id === id);
  } catch (error) {
    // If DB fails or cast error, try local
    const localProducts = await getLocal('products');
    return localProducts.find((p: any) => p._id === id);
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: "Not Found" };
  return {
    title: `${project.title} — Nexoura`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);
  
  if (!project) notFound();

  return <ProjectDetailClient project={project} />;
}
