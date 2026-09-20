import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectCardProps {
  project: ProjectItem;
  searchQuery?: string;
  onSelectProject: (project: ProjectItem) => void;
  renderVisual: (project: ProjectItem) => React.ReactNode;
}

export function ProjectCard({
  project,
  searchQuery,
  onSelectProject,
  renderVisual,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Mouse position normalized relative to the card (-0.5 to +0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth tilt rotation
  const springConfig = { damping: 22, stiffness: 220, mass: 0.5 };
  const rawRotateX = useSpring(useTransform(y, [-0.5, 0.5], [6.5, -6.5]), springConfig);
  const rawRotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6.5, 6.5]), springConfig);

  const rotateX = shouldReduceMotion ? 0 : rawRotateX;
  const rotateY = shouldReduceMotion ? 0 : rawRotateY;

  // Specular reflection glare coordinates
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [10, 90]), springConfig);
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [10, 90]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-full"
      style={{ perspective: 1100 }}
    >
      <motion.article
        id={`project-card-${project.id}`}
        onClick={() => onSelectProject(project)}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.012 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        className="group relative border border-white/10 hover:border-[#7de2ff]/40 rounded-3xl bg-gradient-to-br from-white/[0.035] to-white/[0.01] overflow-hidden hover:shadow-2xl hover:shadow-cyan-950/40 cursor-pointer flex flex-col justify-between h-full will-change-transform"
      >
        {/* Cursor-responsive dynamic specular glare overlay */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx}% ${gy}%, rgba(125, 226, 255, 0.12) 0%, transparent 65%)`
            ),
          }}
        />

        {/* Visual Canvas */}
        <div
          className={`relative border-b border-white/10 overflow-hidden ${
            project.featured && !searchQuery
              ? 'h-[280px] sm:h-[340px]'
              : 'h-[240px] sm:h-[260px]'
          }`}
        >
          {/* Project index */}
          <span className="absolute left-5 top-4 z-20 font-mono-custom text-[10px] text-[#627181]">
            {project.number}
          </span>

          {/* Category chip */}
          <span className="absolute right-5 top-4 z-20 px-2.5 py-1 rounded-full border border-white/10 bg-[#050a0f]/60 backdrop-blur-md font-mono-custom text-[8px] tracking-wider text-[#b4c0cb]">
            {project.chip}
          </span>

          {renderVisual(project)}
        </div>

        {/* Info Body */}
        <div className="p-6 flex flex-col justify-between flex-grow relative z-10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="font-mono-custom text-[8px] tracking-[0.16em] text-[#637181] uppercase mb-1.5">
                {project.type}
              </p>
              <h3 className="font-display font-semibold text-xl tracking-tight text-[var(--text)] group-hover:text-[#7de2ff] transition-colors">
                {project.title}
              </h3>
              <p className="text-xs text-[#8d9aaa] leading-relaxed mt-2 max-w-[540px]">
                {project.description}
              </p>
            </div>

            {/* Direct Action Link or Modal Trigger */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--text)] hover:text-[#7de2ff] transition-colors whitespace-nowrap pt-1"
                >
                  <span>{project.linkLabel || 'Open link'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#7de2ff] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--text)] group-hover:text-[#7de2ff] transition-colors whitespace-nowrap pt-1">
                  <span>View concept</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#7de2ff] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.tags.map((tag, tIdx) => {
              const isTagMatch =
                Boolean(searchQuery) &&
                tag.toLowerCase().includes(searchQuery!.toLowerCase().trim());
              return (
                <span
                  key={tIdx}
                  className={`font-mono-custom text-[9px] border rounded-full px-2.5 py-1 transition-colors ${
                    isTagMatch
                      ? 'border-[#7de2ff]/60 bg-[#7de2ff]/15 text-[#7de2ff] font-semibold'
                      : 'border-white/10 text-[#73808e] bg-white/[0.015]'
                  }`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
      </motion.article>
    </div>
  );
}
