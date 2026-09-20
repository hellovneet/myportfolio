import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Sun, Moon, Search } from 'lucide-react';

interface NavbarProps {
  onOpenAchievements: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  matchCounts?: { projects: number; certs: number };
}

export function Navbar({
  onOpenAchievements,
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  matchCounts,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const target = document.getElementById('projects');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalMatches = (matchCounts?.projects ?? 0) + (matchCounts?.certs ?? 0);

  return (
    <header
      id="main-nav"
      className={`fixed top-3.5 left-1/2 -translate-x-1/2 w-[min(1180px,94vw)] h-[62px] z-50 flex items-center justify-between px-3 md:px-5 border border-white/10 rounded-[20px] transition-all duration-300 ${
        theme === 'light'
          ? 'bg-white/80 border-slate-900/10 text-slate-900 shadow-lg shadow-slate-900/5'
          : 'bg-[#070c12]/80 border-white/10 text-white shadow-xl shadow-black/40'
      } backdrop-blur-xl`}
    >
      {/* Brand */}
      <a
        id="brand-logo"
        href="#home"
        aria-label="HellovNeet home"
        className="flex items-center gap-2.5 font-display font-bold text-[17px] tracking-tight hover:opacity-90 transition-opacity shrink-0"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#7de2ff] shadow-[0_0_16px_#7de2ff] inline-block animate-pulse" />
        <span>
          Hellov<span className="text-[#7de2ff]">Neet</span>
        </span>
      </a>

      {/* Desktop Navigation Links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs shrink-0">
        <a
          id="nav-link-about"
          href="#about"
          className="text-[#8d9aaa] hover:text-[#f2f7fb] dark:hover:text-white transition-colors"
        >
          About
        </a>
        <a
          id="nav-link-projects"
          href="#projects"
          className="text-[#8d9aaa] hover:text-[#f2f7fb] dark:hover:text-white transition-colors"
        >
          Projects
        </a>
        <a
          id="nav-link-iot-lab"
          href="#iot-lab"
          className="text-[#8d9aaa] hover:text-[#7de2ff] dark:hover:text-[#7de2ff] transition-colors flex items-center gap-1"
        >
          <span>IoT Lab</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#7de2ff] animate-pulse" />
        </a>
        <a
          id="nav-link-stack"
          href="#stack"
          className="text-[#8d9aaa] hover:text-[#f2f7fb] dark:hover:text-white transition-colors"
        >
          Stack
        </a>
        <button
          id="nav-link-achievements"
          onClick={onOpenAchievements}
          className="text-[#8d9aaa] hover:text-[#f2f7fb] dark:hover:text-white transition-colors cursor-pointer"
        >
          Achievements
        </button>
        <a
          id="nav-link-contact"
          href="#contact"
          className="text-[#8d9aaa] hover:text-[#f2f7fb] dark:hover:text-white transition-colors"
        >
          Contact
        </a>
      </nav>

      {/* Search Input Field */}
      <div className="relative flex items-center mx-2 sm:mx-3 flex-1 max-w-[280px]">
        <form
          onSubmit={handleSearchSubmit}
          className={`w-full flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 ${
            theme === 'light'
              ? 'bg-slate-100/90 border-slate-200/90 focus-within:border-[#0284c7] focus-within:bg-white'
              : 'bg-white/[0.04] border-white/10 focus-within:border-[#7de2ff]/50 focus-within:bg-[#0c141d]'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-[#8d9aaa] shrink-0" />
          <input
            id="navbar-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onSearchChange('');
            }}
            placeholder="Search projects & certs..."
            className="w-full bg-transparent text-xs text-[var(--text)] placeholder:text-[#657383] focus:outline-none font-mono-custom tracking-tight"
          />
          {searchQuery && (
            <div className="flex items-center gap-1 shrink-0">
              {matchCounts && (
                <span
                  title={`${matchCounts.projects} projects, ${matchCounts.certs} certificates match`}
                  className="px-1.5 py-0.5 rounded text-[9px] bg-[#7de2ff]/20 text-[#7de2ff] font-mono-custom font-semibold"
                >
                  {totalMatches}
                </span>
              )}
              <button
                id="navbar-search-clear-btn"
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="text-[#8d9aaa] hover:text-[var(--text)] p-0.5 cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          id="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 hover:border-[#7de2ff]/40 bg-transparent text-current transition-all duration-300 cursor-pointer overflow-hidden group"
        >
          <Moon
            className={`w-4 h-4 text-slate-700 transition-all duration-300 transform ${
              theme === 'light'
                ? 'opacity-100 rotate-0 scale-100'
                : 'opacity-0 rotate-90 scale-50 pointer-events-none absolute'
            }`}
          />
          <Sun
            className={`w-4 h-4 text-[#7de2ff] transition-all duration-300 transform ${
              theme === 'dark'
                ? 'opacity-100 rotate-0 scale-100'
                : 'opacity-0 -rotate-90 scale-50 pointer-events-none absolute'
            }`}
          />
        </button>

        <a
          id="nav-cta-btn"
          href="#contact"
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-[11px] tracking-wide transition-all duration-200 bg-[var(--text)] text-[var(--bg)] hover:opacity-90 hover:-translate-y-0.5"
        >
          Let's build <ArrowUpRight className="w-3.5 h-3.5" />
        </a>

        {/* Mobile menu button */}
        <button
          id="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Open menu"
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-current cursor-pointer"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div
          id="mobile-nav-dropdown"
          className={`absolute top-[70px] left-0 right-0 p-5 rounded-2xl border flex flex-col gap-3 lg:hidden shadow-2xl backdrop-blur-2xl ${
            theme === 'light'
              ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-900/10'
              : 'bg-[#070c12]/95 border-white/10 text-white shadow-black/80'
          }`}
        >
          {/* Mobile Search input inside dropdown */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
            theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-white/[0.05] border-white/10'
          }`}>
            <Search className="w-4 h-4 text-[#8d9aaa] shrink-0" />
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search title, tech tag..."
              className="w-full bg-transparent text-xs text-[var(--text)] placeholder:text-[#657383] focus:outline-none font-mono-custom"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="p-1 text-[#8d9aaa] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <a
            href="#about"
            onClick={handleNavClick}
            className="text-sm font-medium py-1 text-[#8d9aaa] hover:text-white"
          >
            About
          </a>
          <a
            href="#projects"
            onClick={handleNavClick}
            className="text-sm font-medium py-1 text-[#8d9aaa] hover:text-white flex items-center justify-between"
          >
            <span>Projects</span>
            {searchQuery && matchCounts && (
              <span className="font-mono-custom text-[10px] px-2 py-0.5 rounded bg-[#7de2ff]/20 text-[#7de2ff]">
                {matchCounts.projects}
              </span>
            )}
          </a>
          <a
            href="#iot-lab"
            onClick={handleNavClick}
            className="text-sm font-medium py-1 text-[#8d9aaa] hover:text-[#7de2ff] flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <span>IoT Lab</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#7de2ff] animate-pulse" />
            </span>
            <span className="text-[10px] font-mono-custom text-[#7de2ff] bg-[#7de2ff]/10 px-1.5 py-0.5 rounded">
              Interactive
            </span>
          </a>
          <a
            href="#stack"
            onClick={handleNavClick}
            className="text-sm font-medium py-1 text-[#8d9aaa] hover:text-white"
          >
            Stack
          </a>
          <button
            onClick={() => {
              setMobileOpen(false);
              onOpenAchievements();
            }}
            className="text-left text-sm font-medium py-1 text-[#8d9aaa] hover:text-white cursor-pointer flex items-center justify-between"
          >
            <span>Achievements</span>
            {searchQuery && matchCounts && (
              <span className="font-mono-custom text-[10px] px-2 py-0.5 rounded bg-[#7de2ff]/20 text-[#7de2ff]">
                {matchCounts.certs}
              </span>
            )}
          </button>
          <a
            href="#contact"
            onClick={handleNavClick}
            className="text-sm font-medium py-1 text-[#8d9aaa] hover:text-white"
          >
            Contact
          </a>
          <a
            href="#contact"
            onClick={handleNavClick}
            className="mt-2 text-center py-3 rounded-xl font-bold text-xs bg-[var(--text)] text-[var(--bg)]"
          >
            Let's build ↗
          </a>
        </div>
      )}
    </header>
  );
}
