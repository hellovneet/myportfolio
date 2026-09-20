import { useEffect } from 'react';
import { X, ArrowUpRight, Calendar, Star } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      id="project-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#010509]/85 backdrop-blur-xl transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div className="relative w-[min(760px,94vw)] max-h-[88vh] overflow-y-auto border border-white/15 rounded-[28px] p-6 sm:p-9 bg-gradient-to-br from-[#0c151e] to-[#071018] shadow-[0_40px_120px_rgba(0,0,0,0.7)] text-white z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          id="project-modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-5 top-5 w-9 h-9 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.04] text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Type Header */}
        <p className="font-mono-custom text-[9px] tracking-[0.18em] text-[#657383] uppercase mb-2">
          {project.type}
        </p>

        {/* Title */}
        <h2 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight text-white pr-10 mb-3">
          {project.title}
        </h2>

        {/* Project Activity & Repo Metadata Row */}
        <div
          id="project-modal-metadata-row"
          className="flex flex-wrap items-center gap-3 sm:gap-4 py-2 px-3 sm:px-3.5 mb-5 rounded-xl border border-white/10 bg-white/[0.03] font-mono-custom text-[11px] text-[#8d9aaa]"
        >
          {/* Last Updated */}
          <div className="inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#7de2ff]" />
            <span>Last Updated:</span>
            <span className="text-white font-medium">
              {project.lastUpdated || 'Sep 15, 2026'}
            </span>
          </div>

          <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:inline-block" />

          {/* Repository Stars (Static mock) */}
          <div className="inline-flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-[#ffbd2e] fill-[#ffbd2e]/30" />
            <span>Repository Stars:</span>
            <span className="text-white font-semibold flex items-center gap-1.5">
              {project.stars ?? 42}
              <span className="text-[9px] text-[#7cffb2] bg-[#7cffb2]/10 border border-[#7cffb2]/20 rounded px-1.5 py-0.5 tracking-wider font-normal">
                Active
              </span>
            </span>
          </div>
        </div>

        {/* Narrative */}
        <p className="text-[#8d9aaa] text-sm leading-relaxed mb-6">
          {project.description}
        </p>

        {/* Architecture Data Flow Diagram */}
        <div className="my-6">
          <p className="font-mono-custom text-[9px] text-[#7de2ff] uppercase tracking-widest mb-2">
            SYSTEM ARCHITECTURE / DATA PIPELINE
          </p>
          <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-cyan-500/[0.03] flex items-center justify-center text-center shadow-inner">
            <span className="font-mono-custom text-xs sm:text-sm text-[#7de2ff] font-medium tracking-widest leading-relaxed">
              {project.diagram}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 my-5">
          {project.tags.map((tag, idx) => (
            <span
              key={idx}
              className="font-mono-custom text-[10px] text-[#8d9aaa] border border-white/10 rounded-full px-3 py-1 bg-white/[0.02]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* External Link Action if applicable */}
        {project.link && (
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <a
              id="project-modal-external-link"
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7de2ff] text-slate-950 font-bold text-xs hover:bg-[#a6ecff] transition-colors"
            >
              <span>{project.linkLabel || 'Open Project'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
