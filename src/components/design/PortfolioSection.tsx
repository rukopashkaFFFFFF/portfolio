import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ProjectMock } from '../../types/project';

const CATEGORIES = [
  { value: 'all',       label: 'Все' },
  { value: 'ecommerce', label: 'Магазины' },
  { value: 'crm',       label: 'CRM' },
  { value: 'landing',   label: 'Лендинги' },
  { value: 'corporate', label: 'Корпоративные' },
] as const;

// Deterministic placeholder colour per project
function coverBg(id: string): string {
  const palette = [
    ['#1E2231', '#3D7BFF'],
    ['#1A2232', '#00C2A8'],
    ['#201E2F', '#6B9FFF'],
    ['#1D2228', '#3D7BFF'],
    ['#182030', '#00C2A8'],
    ['#1F1E30', '#6B9FFF'],
  ];
  const idx = id.charCodeAt(0) % palette.length;
  return `linear-gradient(135deg, ${palette[idx][0]} 0%, ${palette[idx][1]}22 100%)`;
}

function ProjectCard({ project, index }: { project: ProjectMock; index: number }) {
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-xl bg-[#151820] overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-[#6B9FFF]"
      style={{
        boxShadow: hovered
          ? '0 2px 32px rgba(61,123,255,0.18), 0 0 0 1px rgba(61,123,255,0.35)'
          : '0 2px 16px rgba(0,0,0,0.32)',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Cover */}
      <div
        className="w-full h-44 flex items-center justify-center overflow-hidden"
        style={{ background: coverBg(project.id) }}
        aria-hidden="true"
      >
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="font-display font-bold text-4xl text-[#E8EAF0]/10 select-none">
            {project.title.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="font-mono text-[10px] text-[#00C2A8] uppercase tracking-widest mb-2">
          {CATEGORIES.find(c => c.value === project.category)?.label ?? project.category}
        </p>
        <h3 className="font-display font-semibold text-lg text-[#E8EAF0] mb-2 leading-snug">
          {project.title}
        </h3>
        <p className="font-body text-sm text-[#6B7280] leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="font-mono text-[10px] text-[#6B9FFF] bg-[#3D7BFF]/10 border border-[#3D7BFF]/20 rounded px-2 py-0.5"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Hover overlay link */}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 focus:outline-none"
          aria-label={`Открыть проект ${project.title}`}
        />
      )}
    </motion.article>
  );
}

export function PortfolioSection({ projects }: { projects: ProjectMock[] }) {
  const [active, setActive] = useState<string>('all');

  const filtered = active === 'all'
    ? projects
    : projects.filter(p => p.category === active);

  return (
    <section
      id="portfolio"
      className="py-24 lg:py-32"
      aria-label="Портфолио"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <p className="font-mono text-xs text-[#00C2A8] uppercase tracking-widest mb-3">Портфолио</p>
          <h2 className="font-display font-bold text-[clamp(2rem,4vw,3rem)] text-[#E8EAF0] leading-tight">
            Что мы уже сделали
          </h2>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
          role="tablist"
          aria-label="Фильтр по категориям"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              role="tab"
              aria-selected={active === cat.value}
              onClick={() => setActive(cat.value)}
              className={[
                'font-mono text-xs px-4 py-2 rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9FFF]',
                active === cat.value
                  ? 'bg-[#3D7BFF]/15 border-[#3D7BFF]/50 text-[#6B9FFF]'
                  : 'bg-transparent border-[#252A3A] text-[#6B7280] hover:border-[#3D7BFF]/40 hover:text-[#E8EAF0]',
              ].join(' ')}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center font-body text-[#6B7280] py-16">
            Проектов в этой категории пока нет.
          </p>
        )}
      </div>
    </section>
  );
}
