const YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-t border-[#252A3A] py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col gap-1">
            <span className="font-display font-bold text-base text-[#E8EAF0]">
              Веб-<span className="gradient-text">Решения</span>
            </span>
            <span className="font-mono text-xs text-[#6B7280]">
              © {YEAR} — Digital-агентство полного цикла
            </span>
          </div>

          {/* Nav */}
          <nav aria-label="Навигация футера" className="flex flex-wrap gap-x-8 gap-y-2">
            {[
              { href: '#portfolio', label: 'Портфолио' },
              { href: '#services',  label: 'Услуги' },
              { href: '#process',   label: 'Процесс' },
              { href: '#contacts',  label: 'Контакты' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs text-[#6B7280] hover:text-[#E8EAF0] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6B9FFF] rounded-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
