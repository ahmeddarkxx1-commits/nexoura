import Link from "next/link";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  let projects: any[] = [];
  try {
    await connectDB();
    projects = await Project.find().sort({ createdAt: -1 });
  } catch (error) {
    console.warn("Database connection failed in projects page.");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-slate-400">Manage your portfolio projects</p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Add Project</span>
        </Link>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="p-4 text-sm font-medium text-slate-300">Project</th>
              <th className="p-4 text-sm font-medium text-slate-300">Category</th>
              <th className="p-4 text-sm font-medium text-slate-300">Price</th>
              <th className="p-4 text-sm font-medium text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  No projects found. Add one to get started.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project._id.toString()} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {project.images && project.images[0] ? (
                        <img src={project.images[0]} alt={project.title} className="w-12 h-12 rounded-lg object-cover bg-[#020408]" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#020408] flex items-center justify-center border border-white/5">
                          <span className="text-xs text-slate-500">No img</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{project.title}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[200px]">{project.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-300 capitalize">{project.category}</td>
                  <td className="p-4 text-sm text-slate-300">${project.price?.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {project.previewLink && (
                        <a href={project.previewLink} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-cyan-400 bg-white/5 rounded-lg transition-colors">
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <Link href={`/admin/projects/${project._id}`} className="p-2 text-slate-400 hover:text-violet-400 bg-white/5 rounded-lg transition-colors">
                        <Edit size={16} />
                      </Link>
                      {/* Delete logic should ideally be a client component or server action */}
                      <form action={`/api/projects/${project._id}/delete`} method="POST">
                         <button type="submit" className="p-2 text-slate-400 hover:text-rose-400 bg-white/5 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
