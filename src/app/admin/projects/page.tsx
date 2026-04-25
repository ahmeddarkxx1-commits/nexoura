import Link from "next/link";
import { Plus, Edit, Trash2, ExternalLink, Folder, Loader2 } from "lucide-react";
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Portfolio Projects</h1>
          <p className="text-slate-400 mt-1">Manage and showcase your best work</p>
        </div>
        <Link 
          href="/admin/projects/new" 
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-violet-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full py-20 glass-card rounded-3xl flex flex-col items-center justify-center border-dashed border-2 border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Folder size={32} className="text-slate-500" />
            </div>
            <p className="text-slate-500 font-medium text-lg">No projects found</p>
            <p className="text-slate-600 text-sm mt-1">Start by adding your first project to the portfolio</p>
          </div>
        ) : (
          projects.map((project) => (
            <div 
              key={project._id.toString()} 
              className="group glass-card rounded-3xl overflow-hidden border border-white/5 hover:border-violet-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10"
            >
              <div className="relative h-48 w-full overflow-hidden">
                {project.images && project.images[0] ? (
                  <img 
                    src={project.images[0]} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full bg-[#0d1117] flex items-center justify-center border-b border-white/5">
                    <Folder size={40} className="text-white/10" />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                    {project.category}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{project.title}</h3>
                  <p className="text-cyan-400 font-black">${project.price?.toLocaleString()}</p>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2 mb-6 h-10">{project.description}</p>
                
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex gap-2">
                    <Link 
                      href={`/admin/projects/${project._id}`} 
                      className="p-2.5 bg-white/5 hover:bg-violet-500/20 text-slate-400 hover:text-violet-400 rounded-xl transition-all border border-white/5"
                    >
                      <Edit size={18} />
                    </Link>
                    <form action={`/api/projects/${project._id}/delete`} method="POST" className="inline">
                       <button 
                        type="submit" 
                        className="p-2.5 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-all border border-white/5"
                        onClick={(e) => !confirm('Are you sure?') && e.preventDefault()}
                      >
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </div>
                  
                  {project.previewLink && (
                    <a 
                      href={project.previewLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                    >
                      <span>Live Preview</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
