import { ArrowUpRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { PinoutExplorer } from './PinoutExplorer';

interface AboutProps {
  onOpenAchievements: () => void;
}

export function About({ onOpenAchievements }: AboutProps) {
  return (
    <section id="about" className="w-[min(1180px,92vw)] mx-auto py-24 sm:py-32 relative z-10">
      {/* Section Header */}
      <Reveal>
        <div className="grid grid-cols-[40px_1fr] sm:grid-cols-[50px_1fr] gap-4 sm:gap-6 items-end mb-12">
          <span className="font-mono-custom text-xs text-[#7de2ff] pb-1 font-semibold">
            02
          </span>
          <div>
            <p className="font-mono-custom text-[9px] tracking-[0.18em] text-[#657383] uppercase mb-2">
              THE PERSON BEHIND THE BUILDS
            </p>
            <h2 className="font-display font-semibold text-[clamp(34px,5vw,58px)] leading-[0.96] tracking-[-0.05em] text-[var(--text)]">
              Still learning.
              <br />
              <em className="not-italic text-[#7de2ff]">Building as I learn.</em>
            </h2>
          </div>
        </div>
      </Reveal>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 items-start">
        {/* Left Column: Narrative Copy */}
        <Reveal delay={100} className="h-full">
          <div className="flex flex-col">
            <p className="font-display font-medium text-[clamp(22px,3vw,34px)] leading-[1.18] tracking-tight text-[var(--text)] mb-6">
              I like taking a rough idea and turning it into something I can <span className="text-[#7de2ff]">actually test.</span>
            </p>
            <p className="text-[#8d9aaa] text-[15px] leading-relaxed mb-4">
              Most of my projects sit somewhere between sensors, microcontrollers, automation and software. I usually start small, test the idea, and improve it as I learn more.
            </p>
            <p className="text-[#8d9aaa] text-[15px] leading-relaxed mb-8">
              Right now I am learning more about embedded systems, robotics, AI-assisted interfaces and modern web development.
            </p>

            <div className="flex items-center gap-6 pt-2">
              <a
                id="about-link-projects"
                href="#projects"
                className="inline-flex items-center gap-1.5 font-mono-custom text-xs text-[var(--text)] border-b border-white/20 hover:border-[#7de2ff] hover:text-[#7de2ff] pb-1 transition-colors"
              >
                <span>See selected builds</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                id="about-link-achievements"
                onClick={onOpenAchievements}
                className="inline-flex items-center gap-1.5 font-mono-custom text-xs text-[var(--text)] border-b border-white/20 hover:border-[#7de2ff] hover:text-[#7de2ff] pb-1 transition-colors cursor-pointer"
              >
                <span>Open achievements</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Right Column: Technical Build Profile Panel with Interactive Hardware Diodes */}
        <Reveal delay={200} className="h-full">
          <div
            id="about-build-profile"
            className="group/profile border border-white/10 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] overflow-hidden shadow-xl"
          >
            {/* Panel Top Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 font-mono-custom text-[10px] tracking-wider text-[#647180]">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7cffb2] animate-ping" />
                <span>BUILD PROFILE</span>
              </span>
              <span className="text-[#7de2ff] px-2 py-0.5 rounded bg-[#7de2ff]/10 border border-[#7de2ff]/20">
                v2.6 • 240MHz
              </span>
            </div>

            {/* Profile Rows */}
            <div className="divide-y divide-white/10">
              <div className="grid grid-cols-[36px_1fr_1.3fr] gap-3 px-6 py-5 items-center hover:bg-white/[0.02] transition-colors group/row">
                <span className="font-mono-custom text-[10px] text-[#566473] group-hover/row:text-[#7de2ff] transition-colors">01</span>
                <b className="text-sm text-[var(--text)] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7de2ff] opacity-60 group-hover/row:opacity-100" />
                  Hardware
                </b>
                <span className="text-xs text-[#8d9aaa] font-mono-custom">Arduino / ESP32 / Sensors</span>
              </div>

              <div className="grid grid-cols-[36px_1fr_1.3fr] gap-3 px-6 py-5 items-center hover:bg-white/[0.02] transition-colors group/row">
                <span className="font-mono-custom text-[10px] text-[#566473] group-hover/row:text-[#a98cff] transition-colors">02</span>
                <b className="text-sm text-[var(--text)] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a98cff] opacity-60 group-hover/row:opacity-100" />
                  Software
                </b>
                <span className="text-xs text-[#8d9aaa] font-mono-custom">HTML / CSS / JS / Electron</span>
              </div>

              <div className="grid grid-cols-[36px_1fr_1.3fr] gap-3 px-6 py-5 items-center hover:bg-white/[0.02] transition-colors group/row">
                <span className="font-mono-custom text-[10px] text-[#566473] group-hover/row:text-[#ff9f5a] transition-colors">03</span>
                <b className="text-sm text-[var(--text)] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f5a] opacity-60 group-hover/row:opacity-100" />
                  Simulation
                </b>
                <span className="text-xs text-[#8d9aaa] font-mono-custom">Wokwi / Tinkercad</span>
              </div>

              <div className="grid grid-cols-[36px_1fr_1.3fr] gap-3 px-6 py-5 items-center hover:bg-white/[0.02] transition-colors group/row">
                <span className="font-mono-custom text-[10px] text-[#566473] group-hover/row:text-[#7cffb2] transition-colors">04</span>
                <b className="text-sm text-[var(--text)] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7cffb2] opacity-60 group-hover/row:opacity-100" />
                  Deployment
                </b>
                <span className="text-xs text-[#8d9aaa] font-mono-custom">GitHub / Vercel / Netlify</span>
              </div>
            </div>

            {/* Panel Footer with Pulse Telemetry */}
            <div className="px-6 py-4 border-t border-white/10 font-mono-custom text-[10px] tracking-widest text-[#7de2ff] bg-white/[0.01] flex items-center justify-between">
              <span>LEARN → BUILD → TEST → IMPROVE</span>
              <span className="text-[#7cffb2] hidden sm:inline">I2C / SPI / UART OK</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Interactive Microcontroller Pinout Matrix */}
      <Reveal delay={250} yOffset={32}>
        <PinoutExplorer />
      </Reveal>
    </section>
  );
}
