import { Search, X } from 'lucide-react';
import { ProjectItem } from '../types';
import { Reveal } from './Reveal';
import { ProjectCard } from './ProjectCard';

interface ProjectsProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

export function Projects({
  projects,
  onSelectProject,
  searchQuery = '',
  onClearSearch,
}: ProjectsProps) {
  const renderVisual = (p: ProjectItem) => {
    switch (p.visualType) {
      case 'mirror':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#060c14] via-[#091522] to-[#122234] overflow-hidden group/viz">
            {/* Ambient Backlight */}
            <div className="absolute w-56 h-56 rounded-full bg-[#7de2ff]/15 blur-3xl pointer-events-none group-hover/viz:scale-110 transition-transform duration-500" />

            {/* Smart Mirror Frame */}
            <div className="relative w-[210px] sm:w-[240px] h-[210px] sm:h-[240px] rounded-t-[120px] rounded-b-[28px] border border-[#7de2ff]/30 shadow-[0_0_90px_rgba(125,226,255,0.18)] flex flex-col items-center justify-between p-5 bg-[#050b12]/75 backdrop-blur-sm overflow-hidden">
              {/* Scanline Sweep */}
              <div className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-[#7de2ff]/30 to-transparent animate-scanline pointer-events-none" />

              {/* Mirror Top HUD Bar */}
              <div className="w-full flex items-center justify-between font-mono-custom text-[8px] text-[#7de2ff]/80 z-10">
                <span>08:42 AM</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7cffb2] animate-pulse" />
                  22°C CLEAR
                </span>
              </div>

              {/* Facial Recognition Target Reticle */}
              <div className="relative w-24 h-28 border border-[#7de2ff]/20 rounded-xl flex items-center justify-center">
                {/* 4 Corner brackets */}
                <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#7de2ff]" />
                <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#7de2ff]" />
                <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#7de2ff]" />
                <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#7de2ff]" />

                {/* Animated scanning bar inside reticle */}
                <div className="w-16 h-0.5 bg-[#7de2ff] shadow-[0_0_12px_#7de2ff] animate-pulse" />
                <div className="absolute font-mono-custom text-[7px] text-[#7de2ff] bottom-1 tracking-widest uppercase">
                  ID: VINEET
                </div>
              </div>

              {/* Mirror Bottom Widget */}
              <div className="w-full flex items-center justify-between z-10 font-mono-custom text-[7px] tracking-wider text-[#8da0b3]">
                <span className="text-[#7cffb2]">MATCH CONF: 99.4%</span>
                <span className="text-[#7de2ff]">FIT ADVISOR: READY</span>
              </div>
            </div>
          </div>
        );

      case 'robot':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0a0f16] via-[#121922] to-[#1a1c22] overflow-hidden group/viz">
            {/* Ambient orange glow */}
            <div className="absolute w-44 h-44 rounded-full bg-[#ff9f5a]/15 blur-2xl pointer-events-none" />

            {/* Radar Grid Circles */}
            <div className="absolute w-48 h-48 rounded-full border border-dashed border-[#ff9f5a]/20" />
            <div className="absolute w-32 h-32 rounded-full border border-white/10" />

            {/* Ultrasonic Radar Sweep Cone */}
            <div className="absolute w-44 h-44 rounded-full animate-radar pointer-events-none">
              <div className="w-1/2 h-1/2 bg-gradient-to-br from-[#ff9f5a]/40 to-transparent rounded-tl-full" />
            </div>

            {/* Central Robot Chassis Diagram */}
            <div className="relative z-10 w-28 h-32 rounded-2xl border border-[#ff9f5a]/50 bg-[#090e15]/90 shadow-[0_0_50px_rgba(255,159,90,0.22)] p-2.5 flex flex-col items-center justify-between">
              {/* Ultrasonic Ping Sensors (2 eyes) */}
              <div className="flex items-center gap-4 mt-1">
                <div className="w-5 h-5 rounded-full border border-[#ff9f5a] flex items-center justify-center bg-[#ff9f5a]/20">
                  <div className="w-2 h-2 rounded-full bg-[#ff9f5a] animate-ping" />
                </div>
                <div className="w-5 h-5 rounded-full border border-[#ff9f5a] flex items-center justify-center bg-[#ff9f5a]/20">
                  <div className="w-2 h-2 rounded-full bg-[#ff9f5a] animate-ping" />
                </div>
              </div>

              {/* L298N Motor Driver status LEDs */}
              <div className="flex items-center gap-2 font-mono-custom text-[7px] text-[#ff9f5a] tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7cffb2] animate-pulse" />
                <span>MOTOR L/R OK</span>
              </div>

              {/* 3 IR Line Following Array (Bottom) */}
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-sm bg-[#ff9f5a] shadow-[0_0_8px_#ff9f5a]" title="Left IR" />
                <span className="w-2 h-2 rounded-sm bg-[#ff9f5a] shadow-[0_0_8px_#ff9f5a]" title="Center IR" />
                <span className="w-2 h-2 rounded-sm bg-[#738290]" title="Right IR" />
              </div>
            </div>

            {/* Ultrasonic wavefront pulse */}
            <div className="absolute w-56 h-56 rounded-full border border-[#ff9f5a]/30 animate-ping-slow pointer-events-none" />
          </div>
        );

      case 'energy':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#061017] via-[#091823] to-[#0c2232] overflow-hidden p-6 group/viz">
            {/* Dynamic circular telemetry gauge */}
            <div className="relative w-44 h-44 rounded-full border-2 border-dashed border-[#7de2ff]/30 animate-spin-slow flex items-center justify-center" />

            {/* Inner Gauge Dial */}
            <div className="absolute w-32 h-32 rounded-full border border-[#7de2ff]/40 bg-[#06111a]/85 shadow-[0_0_60px_rgba(125,226,255,0.25)] flex flex-col items-center justify-center z-10">
              <span className="font-mono-custom text-[8px] tracking-widest text-[#7de2ff]/80 uppercase">
                LOAD METRIC
              </span>
              <span className="font-display font-bold text-2xl text-[var(--text)] my-0.5 tracking-tight">
                248.6 <small className="text-xs font-normal text-[#7de2ff]">W</small>
              </span>
              <span className="font-mono-custom text-[8px] text-[#7cffb2] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7cffb2] animate-ping" />
                230.4V • 50.1Hz
              </span>
            </div>

            {/* Energy Wave Oscilloscope Bottom Bar */}
            <div className="absolute bottom-3 inset-x-8 h-8 overflow-hidden opacity-60">
              <svg className="w-full h-full animate-wave-flow" viewBox="0 0 200 30" fill="none">
                <path
                  d="M 0 15 Q 25 0, 50 15 T 100 15 T 150 15 T 200 15"
                  stroke="#7de2ff"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0a0c16] via-[#121124] to-[#1c1638] overflow-hidden p-6 group/viz">
            {/* Ambient Purple Backlight */}
            <div className="absolute w-44 h-44 rounded-full bg-[#a98cff]/20 blur-3xl pointer-events-none" />

            {/* RFID / Keypad Visual Unit */}
            <div className="relative z-10 w-44 p-3.5 rounded-2xl border border-[#a98cff]/40 bg-[#0c0d1c]/90 shadow-[0_0_60px_rgba(169,140,255,0.2)] flex flex-col items-center gap-2.5">
              {/* Status Header */}
              <div className="w-full flex items-center justify-between font-mono-custom text-[7px] text-[#a98cff] tracking-widest uppercase">
                <span>RFID / PIN</span>
                <span className="text-[#7cffb2] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7cffb2] animate-pulse" />
                  LOCKED
                </span>
              </div>

              {/* Capacitive 3x3 Keypad Grid */}
              <div className="grid grid-cols-3 gap-1.5 w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <div
                    key={num}
                    className="h-6 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center font-mono-custom text-[9px] text-[#c7beff] hover:bg-[#a98cff]/30 transition-colors cursor-default select-none"
                  >
                    {num}
                  </div>
                ))}
              </div>

              {/* RFID Contactless Wave Antenna */}
              <div className="w-full py-1 rounded-lg border border-dashed border-[#a98cff]/30 flex items-center justify-center gap-1.5 font-mono-custom text-[7px] text-[#a98cff]/90">
                <span className="animate-ping-slow">●</span>
                <span>TAP CARD OR FOB</span>
              </div>
            </div>
          </div>
        );

      case 'homeauto':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#060e16] via-[#0b1b28] to-[#12283a] overflow-hidden p-6 group/viz">
            {/* Ambient Cyan Halo */}
            <div className="absolute w-48 h-48 rounded-full bg-[#7de2ff]/15 blur-2xl pointer-events-none" />

            {/* Multi-Node Mesh Network Diagram */}
            <div className="relative w-64 h-36 flex items-center justify-center">
              {/* Animated Dashed Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="128" y1="72" x2="40" y2="30" stroke="#7de2ff" strokeWidth="1.5" className="animate-dash-flow" />
                <line x1="128" y1="72" x2="216" y2="30" stroke="#7de2ff" strokeWidth="1.5" className="animate-dash-flow" />
                <line x1="128" y1="72" x2="128" y2="135" stroke="#7de2ff" strokeWidth="1.5" className="animate-dash-flow" />
              </svg>

              {/* Node 1: Living Room Sensor */}
              <div className="absolute top-2 left-2 px-2 py-1 rounded-lg border border-white/15 bg-[#07131e]/90 font-mono-custom text-[7px] text-[#7de2ff] shadow-md">
                <span>NODE 01: 24°C</span>
              </div>

              {/* Node 2: AC Relay Control */}
              <div className="absolute top-2 right-2 px-2 py-1 rounded-lg border border-white/15 bg-[#07131e]/90 font-mono-custom text-[7px] text-[#7cffb2] shadow-md">
                <span>RELAY: ON</span>
              </div>

              {/* Node 3: Ambient Light Sensor */}
              <div className="absolute bottom-1 px-2 py-1 rounded-lg border border-white/15 bg-[#07131e]/90 font-mono-custom text-[7px] text-[#ff9f5a] shadow-md">
                <span>LUX: 420 lx</span>
              </div>

              {/* Central ESP32 Hub */}
              <div className="relative z-10 w-16 h-16 rounded-2xl border border-[#7de2ff]/50 bg-[#071522] shadow-[0_0_40px_rgba(125,226,255,0.3)] flex flex-col items-center justify-center">
                <span className="font-mono-custom text-[7px] text-[#7de2ff] font-bold">ESP32</span>
                <span className="font-mono-custom text-[6px] text-[#7cffb2] animate-pulse">GATEWAY</span>
              </div>
            </div>
          </div>
        );

      case 'qubit':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#060c14] via-[#0a1824] to-[#102436] overflow-hidden p-6 group/viz">
            {/* 3D Bloch Sphere Wireframe Simulation */}
            <div className="relative w-44 h-44 rounded-full border border-[#7de2ff]/40 flex items-center justify-center shadow-[0_0_60px_rgba(125,226,255,0.2)]">
              {/* Equator Ellipse */}
              <div className="absolute w-44 h-16 rounded-full border border-dashed border-[#7de2ff]/30" />
              {/* Meridian Ellipse */}
              <div className="absolute w-16 h-44 rounded-full border border-[#7de2ff]/25" />

              {/* Z-Axis Line */}
              <div className="absolute h-full w-[1px] bg-gradient-to-b from-[#7de2ff] via-transparent to-[#7de2ff]" />
              {/* Pole labels */}
              <span className="absolute top-1 font-mono-custom text-[9px] text-[#7de2ff] font-bold">|0⟩</span>
              <span className="absolute bottom-1 font-mono-custom text-[9px] text-[#7de2ff] font-bold">|1⟩</span>

              {/* Rotating State Vector Arrow */}
              <div className="relative w-20 h-20 rounded-full border border-cyan-400/40 animate-spin-slow flex items-center justify-center">
                <div className="w-10 h-0.5 bg-gradient-to-r from-transparent to-[#ff9f5a] shadow-[0_0_10px_#ff9f5a]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff9f5a] shadow-[0_0_12px_#ff9f5a] -ml-1" />
              </div>

              {/* Quantum superposition formula badge */}
              <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full border border-white/10 bg-[#07121c]/90 font-mono-custom text-[7px] text-[#7de2ff]">
                |ψ⟩ = α|0⟩ + β|1⟩
              </div>
            </div>
          </div>
        );

      case 'typetrack':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#080d14] via-[#0f1722] to-[#151f2c] overflow-hidden p-6 group/viz">
            {/* Editor Terminal Window */}
            <div className="w-[88%] rounded-xl border border-white/15 bg-[#060b11]/90 shadow-2xl p-3.5 font-mono-custom">
              {/* Window Controls */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[8px] text-[#607183]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                  <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
                </div>
                <span>main.ino • 114 WPM</span>
              </div>

              {/* Code snippet with animated typing cursor */}
              <div className="pt-3 text-[10px] leading-relaxed text-slate-300">
                <span className="text-[#a98cff]">void</span> <span className="text-[#7de2ff]">loop</span>() &#123;
                <br />
                &nbsp;&nbsp;<span className="text-[#ff9f5a]">measureLatency</span>();
                <br />
                &nbsp;&nbsp;<span className="text-[#7cffb2]">sendTelemetry</span>();<span className="inline-block w-1.5 h-3 bg-[#7de2ff] ml-0.5 animate-pulse" />
                <br />
                &#125;
              </div>

              {/* Live WPM & Accuracy Bar */}
              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[8px] text-[#7de2ff]">
                <span>ACCURACY: 99.1%</span>
                <span className="text-[#7cffb2]">BURST: 128 WPM</span>
              </div>
            </div>
          </div>
        );

      case 'railway':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#060d14] via-[#0a1720] to-[#0c1f1c] overflow-hidden p-6 group/viz">
            {/* Track perspective lines */}
            <div className="relative w-56 h-36 flex flex-col items-center justify-center">
              {/* Twin rails */}
              <div className="absolute inset-x-8 top-0 bottom-0 flex justify-between pointer-events-none">
                <div className="w-1.5 h-full bg-gradient-to-b from-slate-600 to-slate-400 shadow-[0_0_12px_rgba(255,255,255,0.2)]" />
                <div className="w-1.5 h-full bg-gradient-to-b from-slate-600 to-slate-400 shadow-[0_0_12px_rgba(255,255,255,0.2)]" />
              </div>

              {/* Track sleepers (horizontal ties) */}
              <div className="w-full flex flex-col gap-3 pointer-events-none opacity-40">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-1 bg-slate-500 rounded-sm" />
                ))}
              </div>

              {/* Laser Obstacle Scan Line */}
              <div className="absolute inset-x-4 h-0.5 bg-[#7cffb2] shadow-[0_0_16px_#7cffb2] animate-scanline" />

              {/* Infrared Triangulation Sensor HUD */}
              <div className="relative z-10 px-3 py-1.5 rounded-xl border border-[#7cffb2]/40 bg-[#061214]/90 shadow-[0_0_40px_rgba(124,255,178,0.2)] font-mono-custom text-[8px] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7cffb2] animate-ping" />
                <span className="text-[#7cffb2] font-semibold">TRACK STATUS: CLEAR</span>
                <span className="text-slate-400">• 0 OBSTACLES</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section id="projects" className="w-[min(1180px,92vw)] mx-auto py-24 sm:py-32 relative z-10">
      {/* Section Head */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-[50px_1fr_auto] gap-4 md:gap-6 items-end mb-12">
          <span className="font-mono-custom text-xs text-[#7de2ff] pb-1 font-semibold hidden md:block">
            03
          </span>
          <div>
            <div className="flex items-center gap-3 md:hidden mb-2">
              <span className="font-mono-custom text-xs text-[#7de2ff] font-semibold">03</span>
              <p className="font-mono-custom text-[9px] tracking-[0.18em] text-[#657383] uppercase">
                SELECTED WORK
              </p>
            </div>
            <p className="font-mono-custom text-[9px] tracking-[0.18em] text-[#657383] uppercase hidden md:block mb-2">
              SELECTED WORK
            </p>
            <h2 className="font-display font-semibold text-[clamp(34px,5vw,58px)] leading-[0.96] tracking-[-0.05em] text-[var(--text)]">
              Things I've <em className="not-italic text-[#7de2ff]">built.</em>
            </h2>
          </div>
          <p className="max-w-[300px] text-xs text-[#8d9aaa] leading-relaxed">
            A mix of hardware prototypes, interactive products and experimental interfaces.
          </p>
        </div>
      </Reveal>

      {/* Active Search Query Indicator */}
      {searchQuery && (
        <div
          id="projects-search-status"
          className="mb-8 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-[#7de2ff]/30 bg-[#7de2ff]/[0.05] backdrop-blur-md"
        >
          <div className="flex items-center gap-2.5 font-mono-custom text-xs text-[#7de2ff]">
            <Search className="w-4 h-4 text-[#7de2ff]" />
            <span>
              Showing <strong className="text-white font-semibold">{projects.length}</strong>{' '}
              {projects.length === 1 ? 'project' : 'projects'} matching "
              <strong className="text-white underline decoration-[#7de2ff]">{searchQuery}</strong>"
            </span>
          </div>
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="inline-flex items-center gap-1 font-mono-custom text-xs text-[#8d9aaa] hover:text-white transition-colors cursor-pointer"
            >
              <span>Clear search</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Projects Grid or Empty State */}
      {projects.length === 0 ? (
        <div
          id="projects-empty-state"
          className="w-full py-16 px-6 text-center border border-dashed border-white/15 rounded-3xl bg-white/[0.015] flex flex-col items-center justify-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#7de2ff]/10 border border-[#7de2ff]/30 flex items-center justify-center mb-4 text-[#7de2ff]">
            <Search className="w-6 h-6" />
          </div>
          <p className="font-mono-custom text-[10px] text-[#7de2ff] uppercase tracking-widest font-semibold mb-1">
            NO PROJECTS MATCHED
          </p>
          <h3 className="font-display font-medium text-xl text-[var(--text)] mb-2">
            No projects found for "{searchQuery}"
          </h3>
          <p className="text-xs text-[#8d9aaa] max-w-[460px] leading-relaxed mb-6">
            Try searching by another title or hardware/software tag like <span className="text-[#7de2ff]">ESP32</span>, <span className="text-[#7de2ff]">Arduino</span>, <span className="text-[#7de2ff]">Robotics</span>, <span className="text-[#7de2ff]">Python</span>, or <span className="text-[#7de2ff]">AI</span>.
          </p>
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="px-5 py-2.5 rounded-xl border border-white/15 hover:border-[#7de2ff]/50 bg-white/[0.04] text-xs font-mono-custom text-white hover:text-[#7de2ff] transition-all cursor-pointer"
            >
              Reset search filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((project, idx) => (
            <Reveal
              key={project.id}
              delay={Math.min((idx % 4) * 80, 240)}
              duration={650}
              yOffset={32}
              className={`h-full ${project.featured && !searchQuery ? 'md:col-span-2' : ''}`}
            >
              <ProjectCard
                project={project}
                searchQuery={searchQuery}
                onSelectProject={onSelectProject}
                renderVisual={renderVisual}
              />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
