import { useState } from 'react';
import { ArrowUpRight, Copy, Check, Mail } from 'lucide-react';
import { Reveal } from './Reveal';

export function Contact() {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const copyToClipboard = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    } catch {
      // Fallback
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    }
  };

  const personalEmail = 'hellovneet@gmail.com';
  const collegeEmail = 'Vineetsharma2505234@dei.ac.in';

  return (
    <section id="contact" className="w-[min(1180px,92vw)] mx-auto py-20 pb-28 relative z-10">
      <Reveal yOffset={32}>
        <div className="border border-white/10 rounded-[34px] p-8 sm:p-14 bg-gradient-to-br from-white/[0.045] to-white/[0.012] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between lg:items-end gap-10 group">
          {/* Ambient radial lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7de2ff]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

          {/* Animated Background Circuit Wire */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <path d="M 0 100 H 200 V 260 H 500" stroke="#7de2ff" strokeWidth="1" fill="none" className="animate-dash-flow" />
          </svg>

          {/* Left: Message */}
          <div className="relative z-10">
            <p className="font-mono-custom text-[9px] tracking-[0.18em] text-[#657383] uppercase mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7cffb2] animate-ping" />
              <span>07 / LET'S CONNECT</span>
            </p>
            <h2 className="font-display font-semibold text-[clamp(42px,6vw,72px)] leading-[0.92] tracking-[-0.06em] text-[var(--text)] mb-5">
              Have an idea?
              <br />
              <em className="not-italic text-[#7de2ff] drop-shadow-[0_0_20px_rgba(125,226,255,0.3)]">Let's build it.</em>
            </h2>
            <p className="text-xs sm:text-sm text-[#8d9aaa] leading-relaxed max-w-[500px]">
              For projects, collaborations, hackathons or just a good tech conversation.
            </p>

            {/* Direct Email Display with Copy Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-[#7de2ff]" />
                  <span className="font-mono-custom text-xs text-[var(--text)] select-all">
                    {personalEmail}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(personalEmail)}
                  aria-label="Copy personal email"
                  className="text-[#8d9aaa] hover:text-[#7de2ff] p-1 cursor-pointer transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedEmail === personalEmail ? (
                    <Check className="w-4 h-4 text-[#7cffb2]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-[#a98cff]" />
                  <span className="font-mono-custom text-xs text-[var(--text)] select-all">
                    {collegeEmail}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(collegeEmail)}
                  aria-label="Copy college email"
                  className="text-[#8d9aaa] hover:text-[#a98cff] p-1 cursor-pointer transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedEmail === collegeEmail ? (
                    <Check className="w-4 h-4 text-[#7cffb2]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Direct Composer Action Buttons */}
          <div className="relative z-10 flex flex-wrap gap-3">
            <a
              id="contact-mail-personal"
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${personalEmail}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl text-xs font-bold transition-all duration-200 bg-[var(--text)] text-[var(--bg)] hover:-translate-y-0.5 hover:shadow-lg shadow-cyan-500/10 whitespace-nowrap"
            >
              <span>Personal Email</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              id="contact-mail-college"
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${collegeEmail}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl text-xs font-bold transition-all duration-200 border border-white/15 hover:border-[#7de2ff]/40 bg-white/[0.03] text-[var(--text)] hover:-translate-y-0.5 whitespace-nowrap"
            >
              <span>College Email</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
