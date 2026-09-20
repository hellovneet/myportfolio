import { useState } from 'react';
import { TECH_STACK } from '../data';
import { Reveal } from './Reveal';
import { Sparkles, Cpu, Code2, Wrench, Layers } from 'lucide-react';
import { LogicAnalyzerWidget } from './LogicAnalyzerWidget';

export function Stack() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Tools', icon: Layers },
    { id: 'iot', label: 'Hardware / IoT', icon: Cpu },
    { id: 'software', label: 'Web & Code', icon: Code2 },
    { id: 'sim', label: 'Sim & Tools', icon: Wrench },
  ];

  const getCategory = (tech: string) => {
    const iot = ['ESP32', 'Arduino', 'Sensors & Actuators', 'Embedded C++', 'Robotics & Motor Drivers'];
    const sim = ['Wokwi', 'Tinkercad', 'Git & GitHub', 'Figma'];
    if (iot.includes(tech)) return 'iot';
    if (sim.includes(tech)) return 'sim';
    return 'software';
  };

  const filteredStack =
    selectedCategory === 'all'
      ? TECH_STACK
      : TECH_STACK.filter((tech) => getCategory(tech) === selectedCategory);

  return (
    <section id="stack" className="w-[min(1180px,92vw)] mx-auto py-24 sm:py-32 relative z-10">
      {/* Section Head */}
      <Reveal>
        <div className="grid grid-cols-[40px_1fr] sm:grid-cols-[50px_1fr] gap-4 sm:gap-6 items-end mb-12">
          <span className="font-mono-custom text-xs text-[#7de2ff] pb-1 font-semibold">
            04
          </span>
          <div>
            <p className="font-mono-custom text-[9px] tracking-[0.18em] text-[#657383] uppercase mb-2">
              TOOLS I USE TO BUILD
            </p>
            <h2 className="font-display font-semibold text-[clamp(34px,5vw,58px)] leading-[0.96] tracking-[-0.05em] text-[var(--text)]">
              My working <em className="not-italic text-[#7de2ff]">stack.</em>
            </h2>
          </div>
        </div>
      </Reveal>

      {/* Stack Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
        {/* Left: Interactive Tech Cloud with Category Filter */}
        <Reveal delay={80} className="h-full">
          <div
            id="stack-tech-cloud"
            className="border border-white/10 rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-white/[0.035] to-white/[0.01] flex flex-col justify-between shadow-xl h-full"
          >
            <div>
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-white/10">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono-custom text-[11px] transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#7de2ff]/15 text-[#7de2ff] border border-[#7de2ff]/40 font-semibold shadow-sm'
                          : 'bg-white/[0.02] text-[#818f9e] border border-white/10 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tag Cloud with Hover Motional Feedback */}
              <div className="flex flex-wrap gap-2.5 content-start">
                {filteredStack.map((tech) => (
                  <span
                    key={tech}
                    className="group relative px-4 py-3 rounded-xl bg-[var(--panel2)] border border-white/10 font-mono-custom text-xs sm:text-[13px] text-[#c1ccd6] hover:text-[#7de2ff] hover:border-[#7de2ff]/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 cursor-default select-none"
                  >
                    <span className="relative z-10">{tech}</span>
                    <span className="absolute inset-0 rounded-xl bg-[#7de2ff]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono-custom text-[#657383]">
              <span>ACTIVE TOOLSET: {filteredStack.length} ITEMS</span>
              <span className="text-[#7de2ff] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7cffb2] animate-pulse" />
                ESP-IDF / NODE.JS READY
              </span>
            </div>
          </div>
        </Reveal>

        {/* Right: Build Loop Principle with Animated Pipeline Wave */}
        <Reveal delay={160} className="h-full">
          <div
            id="stack-build-loop"
            className="relative border border-white/10 rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-white/[0.035] to-white/[0.01] flex flex-col justify-between shadow-xl h-full overflow-hidden"
          >
            {/* Ambient Background Energy Pulse */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#7de2ff]/10 blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono-custom text-[9px] tracking-[0.18em] text-[#657383] uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#7de2ff]" />
                  <span>BUILD LOOP PIPELINE</span>
                </span>
                <span className="font-mono-custom text-[9px] text-[#7cffb2]">CONTINUOUS</span>
              </div>

              {/* Interactive Staged Pipeline */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-8">
                {[
                  { step: '01', title: 'Idea', sub: 'Problem & Specs', color: '#7de2ff' },
                  { step: '02', title: 'Prototype', sub: 'Breadboard & Code', color: '#a98cff' },
                  { step: '03', title: 'Test', sub: 'Wokwi & Scope', color: '#ff9f5a' },
                  { step: '04', title: 'Ship', sub: 'Solder & Deploy', color: '#7cffb2' },
                ].map((s, idx) => (
                  <div
                    key={s.step}
                    className="relative p-3 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all group hover:-translate-y-1"
                  >
                    <span
                      className="font-mono-custom text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded"
                      style={{ color: s.color, backgroundColor: `${s.color}15` }}
                    >
                      {s.step}
                    </span>
                    <h4 className="text-sm font-semibold text-white mt-2 mb-0.5 group-hover:text-[#7de2ff] transition-colors">
                      {s.title}
                    </h4>
                    <p className="text-[10px] text-[#7d8c9a] font-mono-custom leading-tight">
                      {s.sub}
                    </p>

                    {/* Animated connecting pulse */}
                    {idx < 3 && (
                      <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-2 h-2 rounded-full bg-[#7de2ff] animate-ping" />
                    )}
                  </div>
                ))}
              </div>

              {/* Animated Pipeline Cable */}
              <div className="relative h-2 w-full rounded-full bg-white/5 overflow-hidden mb-6">
                <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-[#7de2ff] to-transparent animate-marquee" />
              </div>
            </div>

            <p className="text-xs text-[#8d9aaa] leading-relaxed pt-2 border-t border-white/10">
              I care about the rigorous path from a messy first prototype on a breadboard to a clean, reliable and responsive real-world experience.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Embedded Digital Logic Analyzer & Protocol Visualizer */}
      <Reveal delay={220} yOffset={32}>
        <LogicAnalyzerWidget />
      </Reveal>
    </section>
  );
}
