import { ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-[min(1180px,92vw)] mx-auto border-t border-white/10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-custom text-[10px] tracking-wider text-[#5d6a78]">
      <span>HELLOVNEET © 2026</span>
      <span>Vineet Sharma · IoT / Builder / Explorer</span>
      <button
        onClick={scrollToTop}
        className="inline-flex items-center gap-1.5 text-[#7de2ff] hover:underline cursor-pointer transition-colors"
      >
        <span>Back to top</span>
        <ArrowUp className="w-3 h-3" />
      </button>
    </footer>
  );
}
