import { useState, useRef } from 'react';
import { ArrowDown, ArrowUpRight, Activity, Cpu, Radio, Sparkles } from 'lucide-react';

export function Hero() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section id="home" className="w-[min(1180px,92vw)] mx-auto pt-36 pb-16 min-h-screen grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-14 items-center">
      {/* Left Column: Copy */}
      <div className="flex flex-col items-start z-10">
        {/* Availability Eyebrow */}
        <div
          id="hero-availability-badge"
          className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-[#8d9aaa] text-[9px] font-mono-custom tracking-widest uppercase mb-7 hover:border-[#7de2ff]/40 transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7cffb2] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7cffb2]" />
          </span>
          <span>OPEN TO PROJECTS &amp; COLLABORATION</span>
          <Sparkles className="w-3 h-3 text-[#7de2ff] opacity-70 group-hover:rotate-45 transition-transform" />
        </div>

        {/* Index Serial */}
        <p className="font-mono-custom text-[10px] tracking-[0.2em] text-[#566473] mb-3 flex items-center gap-2">
          <span>HELLOVNEET / 001</span>
          <span className="w-8 h-[1px] bg-white/10 inline-block" />
          <span className="text-[8px] text-[#7de2ff]/70">B.VOC IoT • 2026</span>
        </p>

        {/* Main Headline */}
        <h1 className="font-display font-bold text-[clamp(46px,7vw,94px)] leading-[0.92] tracking-[-0.06em] text-[var(--text)] max-w-[800px] mb-6">
          I build <span className="text-[#7de2ff] relative inline-block transition-transform hover:scale-105 duration-200">things</span>
          <br />
          that feel{' '}
          <i className="not-italic bg-gradient-to-r from-[#ff9f5a] via-[#ffd09e] to-[#ffb877] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(255,159,90,0.3)]">
            alive.
          </i>
        </h1>

        {/* Lead Paragraph */}
        <p className="max-w-[620px] text-[#8d9aaa] text-base leading-relaxed mb-8">
          I'm <strong className="text-[var(--text)] font-semibold">Vineet Sharma</strong> — a B.Voc IoT student who likes building things with Arduino, ESP32, sensors and the web. I learn by making prototypes, breaking them, and trying again.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <a
            id="hero-cta-explore"
            href="#projects"
            className="group inline-flex items-center gap-3 px-5 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 bg-[var(--text)] text-[var(--bg)] hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/20 active:translate-y-0"
          >
            <span>Explore my work</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </a>
          <a
            id="hero-cta-contact"
            href="#contact"
            className="group inline-flex items-center gap-3 px-5 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 border border-white/10 hover:border-[#7de2ff]/40 bg-white/[0.03] text-[var(--text)] hover:-translate-y-1 hover:text-[#7de2ff] active:translate-y-0"
          >
            <span>Start a conversation</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#7de2ff]" />
          </a>
        </div>

        {/* Meta badges with live status indicators */}
        <div className="flex flex-wrap gap-4 font-mono-custom text-[9px] tracking-wider text-[#596676]">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 hover:border-[#7de2ff]/30 transition-colors">
            <Cpu className="w-3 h-3 text-[#7de2ff]" />
            IoT / EMBEDDED
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 hover:border-[#a98cff]/30 transition-colors">
            <Activity className="w-3 h-3 text-[#a98cff]" />
            AI / EXPLORING
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 hover:border-[#7cffb2]/30 transition-colors">
            <Radio className="w-3 h-3 text-[#7cffb2]" />
            WEB / INTERFACES
          </span>
        </div>
      </div>

      {/* Right Column: Interactive 3D Visual Stage */}
      <div
        id="hero-visual-stage"
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-[480px] sm:h-[550px] lg:h-[610px] rounded-[34px] overflow-hidden border border-white/10 bg-gradient-to-br from-[#0c151e] to-[#071018] shadow-2xl shadow-black/60 flex items-center justify-center cursor-crosshair group"
        style={{ perspective: 1000 }}
      >
        {/* 3D Visual Perspective Grid */}
        <div className="visual-grid pointer-events-none" />

        {/* Ambient Halo & Orbit Rings */}
        <div className="absolute w-[440px] h-[440px] rounded-full border border-[#7de2ff]/20 shadow-[0_0_100px_rgba(125,226,255,0.14),inset_0_0_70px_rgba(125,226,255,0.05)] pointer-events-none" />
        <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-white/15 animate-spin-slow pointer-events-none" />
        <div className="absolute w-[280px] h-[280px] rounded-full border border-cyan-400/25 animate-spin-reverse pointer-events-none" />

        {/* Animated Background Circuit SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg">
          <path d="M 40 80 H 160 V 220 H 260" stroke="#7de2ff" strokeWidth="1" fill="none" className="animate-dash-flow" />
          <path d="M 420 120 H 320 V 300 H 220" stroke="#a98cff" strokeWidth="1" fill="none" className="animate-dash-flow" />
          <circle cx="160" cy="220" r="3" fill="#7de2ff" className="animate-ping-slow" />
          <circle cx="320" cy="300" r="3" fill="#a98cff" className="animate-ping-slow" />
        </svg>

        {/* Profile Container with 3D Parallax Tilt */}
        <div
          className="relative z-10 w-[240px] sm:w-[280px] lg:w-[300px] h-[320px] sm:h-[370px] lg:h-[390px] rounded-t-[150px] rounded-b-[26px] overflow-hidden border border-white/20 shadow-[0_35px_80px_rgba(0,0,0,0.65),0_0_60px_rgba(125,226,255,0.18)] transition-transform duration-200 ease-out"
          style={{
            transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(1.02)`,
          }}
        >
          <img
            src="/assets/vineet-profile.png"
            alt="Vineet Sharma — HellovNeet"
            className="w-full h-full object-cover object-top filter contrast-[1.04] select-none"
            loading="eager"
          />
          {/* Subtle reflection shine */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071018]/80 via-transparent to-white/10 pointer-events-none" />
        </div>

        {/* Floating Card One: Top Left with Autonomous Floating Motion */}
        <div
          id="hero-badge-focus"
          className="absolute z-20 top-[12%] left-[5%] sm:left-[8%] px-4 py-3 rounded-2xl border border-white/10 bg-[#070e15]/85 backdrop-blur-md shadow-xl animate-float-slow hover:border-[#7de2ff]/40 transition-all duration-300"
          style={{
            transform: `translate3d(${tilt.x * -0.8}px, ${tilt.y * -0.8}px, 0)`,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7de2ff] animate-pulse" />
            <small className="font-mono-custom text-[8px] tracking-widest text-[#667383]">
              FOCUS
            </small>
          </div>
          <b className="block text-xs sm:text-sm font-semibold text-white my-0.5">
            IoT × AI
          </b>
          <span className="block font-mono-custom text-[8px] text-[#7de2ff] tracking-wider">
            building + learning
          </span>
        </div>

        {/* Floating Card Two: Bottom Right with Counter-Phase Floating Motion */}
        <div
          id="hero-badge-mode"
          className="absolute z-20 bottom-[16%] right-[5%] sm:right-[7%] px-4 py-3 rounded-2xl border border-white/10 bg-[#070e15]/85 backdrop-blur-md shadow-xl animate-float-delayed hover:border-[#ff9f5a]/40 transition-all duration-300"
          style={{
            transform: `translate3d(${tilt.x * 0.9}px, ${tilt.y * 0.9}px, 0)`,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f5a] animate-pulse" />
            <small className="font-mono-custom text-[8px] tracking-widest text-[#667383]">
              MODE
            </small>
          </div>
          <b className="block text-xs sm:text-sm font-semibold text-white my-0.5">
            MAKE / TEST
          </b>
          <span className="block font-mono-custom text-[8px] text-[#ff9f5a] tracking-wider">
            prototype → iterate
          </span>
        </div>

        {/* Serial Status Bottom Left with Live Oscilloscope Wave */}
        <div className="absolute bottom-5 left-6 z-20 font-mono-custom text-[8px] leading-relaxed text-[#506071] tracking-widest flex items-end gap-3">
          <div>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7cffb2] animate-ping" />
              BUILD.STATUS <b className="text-[#7cffb2] font-semibold">READY</b>
            </span>
            <span>ESP32 / BLE / MQTT</span>
          </div>

          {/* Animated Mini Oscilloscope Wave */}
          <div className="hidden sm:flex items-center h-4 w-16 overflow-hidden border border-white/10 rounded px-1 bg-black/40">
            <svg className="w-24 h-3 animate-wave-flow" viewBox="0 0 100 20" fill="none">
              <path
                d="M 0 10 Q 12 0, 25 10 T 50 10 T 75 10 T 100 10"
                stroke="#7de2ff"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        {/* Ambient Top Right IoT Node Telemetry */}
        <div className="absolute top-5 right-6 z-20 font-mono-custom text-[8px] tracking-widest text-[#627181] hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/10 bg-[#070e15]/85 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7de2ff] animate-pulse" />
            <span className="text-[#7de2ff] font-semibold">IoT</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>ESP32</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-[#7cffb2]">BUILDING</span>
        </div>
      </div>
    </section>
  );
}
