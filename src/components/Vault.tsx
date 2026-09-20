import { ArrowUpRight, Search, X } from 'lucide-react';
import { CERTIFICATES } from '../data';
import { CertificateItem } from '../types';
import { Reveal } from './Reveal';

interface VaultProps {
  onOpenAllCerts: () => void;
  onSelectCert: (cert: CertificateItem) => void;
  searchQuery?: string;
  filteredCerts?: CertificateItem[];
  onClearSearch?: () => void;
}

export function Vault({
  onOpenAllCerts,
  onSelectCert,
  searchQuery = '',
  filteredCerts = CERTIFICATES,
  onClearSearch,
}: VaultProps) {
  const featured = filteredCerts[0] || CERTIFICATES[0];
  const isFiltered = Boolean(searchQuery && searchQuery.trim());

  return (
    <section id="vault" className="w-[min(1180px,92vw)] mx-auto py-24 sm:py-32 relative z-10">
      {/* Section Head */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-[50px_1fr_auto] gap-4 md:gap-6 items-end mb-12">
          <span className="font-mono-custom text-xs text-[#7de2ff] pb-1 font-semibold hidden md:block">
            05
          </span>
          <div>
            <div className="flex items-center gap-3 md:hidden mb-2">
              <span className="font-mono-custom text-xs text-[#7de2ff] font-semibold">05</span>
              <p className="font-mono-custom text-[9px] tracking-[0.18em] text-[#657383] uppercase">
                PROOF OF LEARNING
              </p>
            </div>
            <p className="font-mono-custom text-[9px] tracking-[0.18em] text-[#657383] uppercase hidden md:block mb-2">
              PROOF OF LEARNING
            </p>
            <h2 className="font-display font-semibold text-[clamp(34px,5vw,58px)] leading-[0.96] tracking-[-0.05em] text-[var(--text)]">
              Achievement <em className="not-italic text-[#7de2ff]">Vault.</em>
            </h2>
          </div>
          <p className="max-w-[300px] text-xs text-[#8d9aaa] leading-relaxed">
            {isFiltered
              ? `Filtered view: ${filteredCerts.length} matching certification(s) found.`
              : 'One featured certificate here. Open the vault to explore the complete collection.'}
          </p>
        </div>
      </Reveal>

      {/* Active Search Status in Vault */}
      {isFiltered && (
        <div
          id="vault-search-status"
          className="mb-8 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-[#7de2ff]/30 bg-[#7de2ff]/[0.05] backdrop-blur-md"
        >
          <div className="flex items-center gap-2.5 font-mono-custom text-xs text-[#7de2ff]">
            <Search className="w-4 h-4 text-[#7de2ff]" />
            <span>
              Showing <strong className="text-white font-semibold">{filteredCerts.length}</strong>{' '}
              {filteredCerts.length === 1 ? 'certificate' : 'certificates'} matching "
              <strong className="text-white underline decoration-[#7de2ff]">{searchQuery}</strong>"
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAllCerts}
              className="font-mono-custom text-xs text-[#7de2ff] hover:underline cursor-pointer"
            >
              Open in vault modal →
            </button>
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="inline-flex items-center gap-1 font-mono-custom text-xs text-[#8d9aaa] hover:text-white transition-colors cursor-pointer"
              >
                <span>Clear</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Certificates Content */}
      {isFiltered && filteredCerts.length === 0 ? (
        <div
          id="vault-empty-state"
          className="w-full py-14 px-6 text-center border border-dashed border-white/15 rounded-3xl bg-white/[0.015] flex flex-col items-center justify-center"
        >
          <p className="font-mono-custom text-[10px] text-[#7de2ff] uppercase tracking-widest font-semibold mb-1">
            NO CERTIFICATES MATCHED
          </p>
          <h3 className="font-display font-medium text-lg text-[var(--text)] mb-2">
            No certificates found for "{searchQuery}"
          </h3>
          <p className="text-xs text-[#8d9aaa] max-w-[420px] leading-relaxed mb-5">
            Search checks certificate titles (e.g., Python, C++, Cybersecurity, AI, Quantum, Web Development) and issuers (DEI, Cisco, IBM, IEEE, Google).
          </p>
          <button
            onClick={onOpenAllCerts}
            className="px-5 py-2.5 rounded-xl border border-white/15 hover:border-[#7de2ff]/50 bg-white/[0.04] text-xs font-mono-custom text-white hover:text-[#7de2ff] transition-all cursor-pointer"
          >
            Explore all {CERTIFICATES.length} certificates
          </button>
        </div>
      ) : isFiltered ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCerts.map((cert) => (
              <article
                key={cert.id}
                id={`vault-filtered-cert-${cert.id}`}
                onClick={() => onSelectCert(cert)}
                className="group border border-white/10 hover:border-[#7de2ff]/35 rounded-2xl overflow-hidden bg-gradient-to-br from-white/[0.035] to-white/[0.01] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
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
                  <h3 className="font-display font-semibold text-sm sm:text-base text-[var(--text)] line-clamp-2 mb-1 group-hover:text-[#7de2ff] transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-[11px] text-[#8d9aaa] line-clamp-1 leading-relaxed">
                    {cert.issuer}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <button
              id="open-vault-btn-filtered"
              onClick={onOpenAllCerts}
              className="border border-white/10 hover:border-[#7de2ff]/40 bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:bg-[#7de2ff]/10 text-[var(--text)] hover:text-[#7de2ff] rounded-full px-6 py-3 font-mono-custom text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md"
            >
              <span>Explore all in Vault Modal</span>
              <ArrowUpRight className="w-4 h-4 text-[#7de2ff]" />
            </button>
          </div>
        </div>
      ) : (
        /* Default: Featured Certificate Card */
        <Reveal delay={100}>
          <div className="flex flex-col lg:flex-row items-stretch gap-4">
            <article
              id="featured-cert-card"
              onClick={() => onSelectCert(featured)}
              className="group relative flex-1 grid grid-cols-1 sm:grid-cols-[minmax(260px,42%)_1fr] border border-white/10 hover:border-[#7de2ff]/30 rounded-3xl bg-gradient-to-br from-white/[0.035] to-white/[0.01] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
            >
              {/* Featured Badge */}
              <span className="absolute left-4 top-4 z-20 px-2.5 py-1 rounded-full border border-[#7de2ff]/30 bg-[#050a0f]/80 backdrop-blur-md text-[#7de2ff] font-mono-custom text-[8px] tracking-widest font-semibold">
                FEATURED
              </span>

              {/* Certificate Image */}
              <div className="relative min-h-[200px] sm:min-h-[260px] bg-[#081018] overflow-hidden">
                <img
                  src={featured.img}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Certificate Body */}
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <small className="font-mono-custom text-[9px] text-[#7de2ff] tracking-widest uppercase mb-2">
                  {featured.badge}
                </small>
                <h3 className="font-display font-semibold text-xl sm:text-2xl text-[var(--text)] tracking-tight mb-2 group-hover:text-[#7de2ff] transition-colors">
                  {featured.title}
                </h3>
                <p className="text-xs text-[#8d9aaa] leading-relaxed">
                  {featured.issuer}
                </p>
              </div>
            </article>

            {/* View All Button */}
            <button
              id="open-vault-btn"
              onClick={onOpenAllCerts}
              className="lg:self-center border border-white/10 hover:border-[#7de2ff]/40 bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:bg-[#7de2ff]/10 text-[var(--text)] hover:text-[#7de2ff] rounded-full px-6 py-4 font-mono-custom text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer whitespace-nowrap shadow-md"
            >
              <span>View all certificates</span>
              <ArrowUpRight className="w-4 h-4 text-[#7de2ff]" />
            </button>
          </div>
        </Reveal>
      )}
    </section>
  );
}
