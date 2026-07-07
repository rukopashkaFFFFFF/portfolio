import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const NAV_LINKS = [
  { href: '#portfolio', label: 'Портфолио' },
  { href: '#services',  label: 'Услуги'    },
  { href: '#process',   label: 'Процесс'   },
  { href: '#contacts',  label: 'Контакты'  },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on nav click
  const handleNavClick = () => setMenuOpen(false);

  return (
    <motion.header
      initial={prefersReduced ? false : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#0D0F14]/90 backdrop-blur-md border-b border-[#252A3A]'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9FFF] rounded-md"
          aria-label="Веб-Решения — главная"
        >
          <span className="font-display font-bold text-lg text-[#E8EAF0] tracking-tight leading-none">
            Веб-<span className="gradient-text">Решения</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Основная навигация">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-sm text-[#6B7280] hover:text-[#E8EAF0] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9FFF] rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <a
            href="#contacts"
            className="btn-shimmer inline-flex items-center h-9 px-5 rounded-full font-display font-semibold text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9FFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0F14]"
          >
            Обсудить проект
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9FFF] rounded-md"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label="Открыть меню"
        >
          <span className={`block w-5 h-0.5 bg-[#E8EAF0] transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[#E8EAF0] transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[#E8EAF0] transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-[#151820] border-t border-[#252A3A] px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="font-body text-base text-[#E8EAF0] py-2 border-b border-[#252A3A] last:border-0"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contacts"
            onClick={handleNavClick}
            className="btn-shimmer mt-2 inline-flex items-center justify-center h-11 px-6 rounded-full font-display font-semibold text-sm text-white"
          >
            Обсудить проект
          </a>
        </div>
      )}
    </motion.header>
  );
}
