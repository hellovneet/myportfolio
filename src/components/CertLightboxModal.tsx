import { useEffect } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { CertificateItem } from '../types';

interface CertLightboxModalProps {
  cert: CertificateItem | null;
  onClose: () => void;
}

export function CertLightboxModal({ cert, onClose }: CertLightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (cert) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cert, onClose]);

  if (!cert) return null;

  return (
    <div
      id="cert-lightbox-modal"
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Lightbox Container */}
      <div className="relative w-[min(900px,96vw)] max-h-[92vh] overflow-y-auto border border-white/20 rounded-3xl p-5 sm:p-8 bg-gradient-to-br from-[#0c151e] to-[#071018] shadow-2xl text-white z-10 animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Close Button */}
        <button
          id="lightbox-close-btn"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 w-9 h-9 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.04] text-white flex items-center justify-center transition-colors cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate metadata */}
        <div className="mb-4 pr-12">
          <span className="font-mono-custom text-[9px] text-[#7de2ff] uppercase tracking-widest font-semibold block mb-1">
            {cert.badge}
          </span>
          <h2 className="font-display font-semibold text-lg sm:text-2xl text-white tracking-tight">
            {cert.title}
          </h2>
          <p className="text-xs text-[#8d9aaa] mt-1">
            {cert.issuer}
          </p>
        </div>

        {/* High-Resolution Certificate Image */}
        <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/50 max-h-[65vh] flex items-center justify-center">
          <img
            src={cert.img}
            alt={cert.title}
            className="w-full h-auto max-h-[65vh] object-contain rounded-xl"
          />
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-mono-custom text-[#657383]">
          <span>VERIFIED RECORD · HELLOVNEET ARCHIVE</span>
          <a
            href={cert.img}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#7de2ff] hover:underline"
          >
            <span>Open raw image</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
