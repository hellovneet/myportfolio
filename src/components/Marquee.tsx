export function Marquee() {
  const items = [
    { text: 'ARDUINO', color: '#7de2ff' },
    { text: 'ESP32', color: '#ff9f5a' },
    { text: 'ROBOTICS', color: '#7cffb2' },
    { text: 'AI EXPERIMENTS', color: '#a98cff' },
    { text: 'SMART AUTOMATION', color: '#7de2ff' },
    { text: 'WEB EXPERIENCES', color: '#ffd09e' },
    { text: 'EMBEDDED SYSTEMS', color: '#7cffb2' },
    { text: 'TINKERCAD', color: '#a98cff' },
    { text: 'WOKWI', color: '#7de2ff' },
    { text: 'COMPUTER VISION', color: '#ff9f5a' },
  ];

  // Repeat items to ensure seamless loop
  const list = [...items, ...items];

  return (
    <div
      id="tech-marquee-wrapper"
      className="relative z-10 w-full overflow-hidden border-y border-white/10 bg-white/[0.015] py-4 select-none group"
    >
      {/* Left and Right Smooth Edge Fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-[var(--bg)] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-[var(--bg)] to-transparent z-10" />

      <div className="flex w-max items-center gap-8 animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap font-mono-custom text-[11px] tracking-[0.18em] text-[#657281]">
        {list.map((item, idx) => (
          <span key={idx} className="inline-flex items-center gap-8">
            <span
              className="hover:text-white transition-colors cursor-default"
              style={{ '--accent-item': item.color } as any}
            >
              {item.text}
            </span>
            <span
              className="text-xs transition-transform hover:rotate-90 duration-300"
              style={{ color: item.color }}
            >
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
