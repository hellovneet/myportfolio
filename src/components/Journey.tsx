import { TIMELINE_ITEMS } from '../data';
import { Reveal } from './Reveal';
import { GitHubContributionHeatmap } from './GitHubContributionHeatmap';

export function Journey() {
  return (
    <section id="journey" className="w-[min(1180px,92vw)] mx-auto py-24 sm:py-32 relative z-10">
      {/* Section Head */}
      <Reveal>
        <div className="grid grid-cols-[40px_1fr] sm:grid-cols-[50px_1fr] gap-4 sm:gap-6 items-end mb-16">
          <span className="font-mono-custom text-xs text-[#7de2ff] pb-1 font-semibold">
            06
          </span>
          <div>
            <p className="font-mono-custom text-[9px] tracking-[0.18em] text-[#657383] uppercase mb-2">
              HOW IT'S EVOLVING
            </p>
            <h2 className="font-display font-semibold text-[clamp(34px,5vw,58px)] leading-[0.96] tracking-[-0.05em] text-[var(--text)]">
              From <em className="not-italic text-[#7de2ff]">curiosity</em> to capability.
            </h2>
          </div>
        </div>
      </Reveal>

      {/* Timeline with Animated Glowing Gradient Trace */}
      <div className="relative border-l border-white/10 ml-6 sm:ml-8 pl-8 sm:pl-10 space-y-12">
        {/* Animated Line Light Tracer */}
        <div className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#7de2ff]/60 to-transparent pointer-events-none" />

        {TIMELINE_ITEMS.map((item, idx) => (
          <Reveal key={item.step} delay={idx * 90} yOffset={24}>
            <div className="relative group">
              {/* Number indicator node with pulse halo */}
              <span className="absolute -left-[53px] sm:-left-[61px] top-0 w-10 sm:w-11 h-10 sm:h-11 rounded-full border border-white/15 bg-[var(--bg)] group-hover:border-[#7de2ff] group-hover:shadow-[0_0_20px_rgba(125,226,255,0.4)] flex items-center justify-center font-mono-custom text-xs text-[#7de2ff] shadow-md transition-all duration-300">
                {item.step}
                <span className="absolute inset-0 rounded-full bg-[#7de2ff]/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none" />
              </span>

              {/* Content block */}
              <div className="pt-1 p-4 -ml-4 rounded-2xl transition-all duration-200 group-hover:bg-white/[0.015]">
                <small className="font-mono-custom text-[9px] text-[#657383] tracking-[0.16em] uppercase flex items-center gap-2 mb-1">
                  <span>{item.phase}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7de2ff]/50 inline-block" />
                  <span className="text-[#7de2ff]">MILESTONE</span>
                </small>
                <h3 className="font-display font-medium text-xl sm:text-2xl text-[var(--text)] group-hover:text-[#7de2ff] transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8d9aaa] leading-relaxed max-w-[620px]">
                  {item.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* GitHub Contribution Heatmap & Activity Widget */}
      <Reveal delay={150} yOffset={32}>
        <GitHubContributionHeatmap />
      </Reveal>
    </section>
  );
}
