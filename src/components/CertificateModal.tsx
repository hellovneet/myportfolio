import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { CERTIFICATES } from '../data';
import { CertificateCategory, CertificateItem } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCert: (cert: CertificateItem) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function CertificateModal({
  isOpen,
  onClose,
  onSelectCert,
  searchQuery = '',
  onSearchChange,
}: CertificateModalProps) {
  const [filter, setFilter] = useState<CertificateCategory>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const query = searchQuery.trim().toLowerCase();
  const filteredCerts = CERTIFICATES.filter((c) => {
    const matchesCategory = filter === 'all' || c.category === filter;
    if (!matchesCategory) return false;
    if (!query) return true;
    return (
      c.title.toLowerCase().includes(query) ||
      c.issuer.toLowerCase().includes(query) ||
      c.badge.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query)
    );
  });

  return (
    <div
      id="certificate-vault-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#010509]/85 backdrop-blur-xl transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-[min(1080px,95vw)] max-h-[90vh] overflow-y-auto border border-white/15 rounded-[28px] p-6 sm:p-9 bg-gradient-to-br from-[#0c151e] to-[#071018] shadow-[0_40px_120px_rgba(0,0,0,0.8)] text-white z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          id="cert-modal-close-btn"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 w-9 h-9 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.04] text-white flex items-center justify-center transition-colors cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <p className="font-mono-custom text-[9px] tracking-[0.18em] text-[#657383] uppercase mb-1.5">
          05 / CERTIFICATES
        </p>
        <h2 className="font-display font-semibold text-2xl sm:text-4xl tracking-tight text-white mb-6">
          Certificate <em className="not-italic text-[#7de2ff]">Collection.</em>
        </h2>

        {/* Toolbar: Category tabs and Filter input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'technical', 'learning', 'participation'] as CertificateCategory[]).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full font-mono-custom text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
                    filter === cat
                      ? 'border-[#7de2ff]/50 bg-[#7de2ff]/15 text-[#7de2ff] shadow-sm font-semibold'
                      : 'border-white/10 text-[#8d9aaa] hover:text-white hover:border-white/25 bg-transparent'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              )
            )}
          </div>

          {/* Inline search input inside modal */}
          {onSearchChange && (
            <div className="relative flex items-center w-full sm:w-64">
              <div className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] focus-within:border-[#7de2ff]/50 focus-within:bg-[#0c141d] transition-colors">
                <Search className="w-3.5 h-3.5 text-[#8d9aaa] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Filter certificates..."
                  className="w-full bg-transparent text-xs text-white placeholder:text-[#657383] focus:outline-none font-mono-custom"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="text-[#8d9aaa] hover:text-white p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Certificates Grid or Empty State */}
        {filteredCerts.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/15 rounded-2xl p-6">
            <p className="font-mono-custom text-xs text-[#7de2ff] uppercase mb-1">
              NO CERTIFICATES MATCHED
            </p>
            <h3 className="font-display text-lg text-white mb-2">
              No matching certificates found
            </h3>
            <p className="text-xs text-[#8d9aaa] max-w-sm mx-auto mb-4">
              Try adjusting the category filter or searching for a different topic (e.g. Python, Cisco, AI).
            </p>
            {searchQuery && onSearchChange && (
              <button
                onClick={() => onSearchChange('')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono-custom text-white transition-colors cursor-pointer"
              >
                Clear search query
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCerts.map((cert) => (
              <article
                key={cert.id}
                onClick={() => onSelectCert(cert)}
                className="group border border-white/10 hover:border-[#7de2ff]/35 rounded-2xl overflow-hidden bg-gradient-to-br from-white/[0.035] to-white/[0.01] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[16/10] bg-[#081018] overflow-hidden relative">
                  <span className="absolute left-3 top-3 z-10 px-2 py-0.5 rounded-full border border-[#7de2ff]/30 bg-[#050a0f]/80 backdrop-blur-md text-[#7de2ff] font-mono-custom text-[8px] tracking-widest font-semibold uppercase">
                    {cert.badge}
                  </span>
                  <img
                    src={cert.img}
                    alt={cert.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-sm sm:text-base text-white line-clamp-2 mb-1 group-hover:text-[#7de2ff] transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-[11px] text-[#8d9aaa] line-clamp-2 leading-relaxed">
                    {cert.issuer}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
