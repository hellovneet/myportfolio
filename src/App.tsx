import { useState, useEffect, useRef, useMemo } from 'react';
import { ProjectItem, CertificateItem } from './types';
import { PROJECTS, CERTIFICATES } from './data';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { IoTWorkbench } from './components/IoTWorkbench';
import { Stack } from './components/Stack';
import { Vault } from './components/Vault';
import { Journey } from './components/Journey';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { CertificateModal } from './components/CertificateModal';
import { CertLightboxModal } from './components/CertLightboxModal';
import { AmbientCircuitCanvas } from './components/AmbientCircuitCanvas';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isThemeFading, setIsThemeFading] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isCertVaultOpen, setIsCertVaultOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const glowRef = useRef<HTMLDivElement | null>(null);

  // Compute filtered projects by title, technology tags, category chip, or description
  const query = searchQuery.trim().toLowerCase();
  const filteredProjects = useMemo(() => {
    if (!query) return PROJECTS;
    return PROJECTS.filter((p) => {
      const inTitle = p.title.toLowerCase().includes(query);
      const inTags = p.tags.some((t) => t.toLowerCase().includes(query));
      const inChip = p.chip.toLowerCase().includes(query);
      const inType = p.type.toLowerCase().includes(query);
      const inDesc = p.description.toLowerCase().includes(query);
      return inTitle || inTags || inChip || inType || inDesc;
    });
  }, [query]);

  // Compute filtered certificates by title, issuer, badge, or category
  const filteredCerts = useMemo(() => {
    if (!query) return CERTIFICATES;
    return CERTIFICATES.filter((c) => {
      const inTitle = c.title.toLowerCase().includes(query);
      const inIssuer = c.issuer.toLowerCase().includes(query);
      const inBadge = c.badge.toLowerCase().includes(query);
      const inCategory = c.category.toLowerCase().includes(query);
      return inTitle || inIssuer || inBadge || inCategory;
    });
  }, [query]);

  // Initialize and synchronize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('hellovneet-theme') as 'dark' | 'light' | null;
    if (savedTheme === 'light') {
      setTheme('light');
      document.body.classList.add('light');
    } else {
      setTheme('dark');
      document.body.classList.remove('light');
    }
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';

    const updateDOM = (nextTheme: 'dark' | 'light') => {
      if (nextTheme === 'light') {
        document.body.classList.add('light');
      } else {
        document.body.classList.remove('light');
      }
      localStorage.setItem('hellovneet-theme', nextTheme);
    };

    // Activate transition flag for smooth CSS transitions across UI elements
    document.documentElement.classList.add('theme-transitioning');
    setIsThemeFading(true);

    const applyTheme = () => {
      setTheme(next);
      updateDOM(next);
    };

    // Use native View Transition API when available for a cinematic cross-fade
    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      typeof (document as any).startViewTransition === 'function'
    ) {
      try {
        (document as any).startViewTransition(() => {
          applyTheme();
        });
      } catch {
        applyTheme();
      }
    } else {
      applyTheme();
    }

    // Clean up temporary transition class and veil after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
      setIsThemeFading(false);
    }, 450);
  };

  // Scroll Progress Tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cursor Glow Tracking
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-[#7de2ff]/30 selection:text-[#7de2ff]">
      {/* Subtle Theme Cross-Fade Radial Veil */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-[60] transition-opacity duration-500 ease-out ${
          isThemeFading ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            theme === 'light'
              ? 'radial-gradient(circle at 88% 30px, rgba(238, 245, 248, 0.45) 0%, rgba(238, 245, 248, 0.15) 45%, transparent 75%)'
              : 'radial-gradient(circle at 88% 30px, rgba(5, 8, 13, 0.5) 0%, rgba(5, 8, 13, 0.2) 45%, transparent 75%)',
        }}
      />

      {/* Background Noise Texture */}
      <div className="noise" />

      {/* Ambient Animated Circuit Traces & Signal Pulses */}
      <AmbientCircuitCanvas />

      {/* Interactive Cursor Ambient Glow */}
      <div ref={glowRef} className="cursor-glow hidden md:block" />

      {/* Top Reading Progress Bar */}
      <div
        id="scroll-progress-bar"
        className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-[#7de2ff] via-[#a98cff] to-[#ff9f5a] z-[100] transition-[width] duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Main Navigation */}
      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAchievements={() => setIsCertVaultOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        matchCounts={{
          projects: filteredProjects.length,
          certs: filteredCerts.length,
        }}
      />

      {/* Page Content Sections */}
      <main>
        <Hero />
        <Marquee />
        <About onOpenAchievements={() => setIsCertVaultOpen(true)} />
        <Projects
          projects={filteredProjects}
          onSelectProject={(project) => setSelectedProject(project)}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
        />
        <IoTWorkbench />
        <Stack />
        <Vault
          searchQuery={searchQuery}
          filteredCerts={filteredCerts}
          onClearSearch={() => setSearchQuery('')}
          onOpenAllCerts={() => setIsCertVaultOpen(true)}
          onSelectCert={(cert) => setSelectedCert(cert)}
        />
        <Journey />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Certificate Vault Collection Modal */}
      <CertificateModal
        isOpen={isCertVaultOpen}
        onClose={() => setIsCertVaultOpen(false)}
        onSelectCert={(cert) => setSelectedCert(cert)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* High-Resolution Certificate Lightbox Modal */}
      <CertLightboxModal
        cert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
