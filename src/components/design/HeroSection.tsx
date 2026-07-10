import { useRef } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { BlueprintGrid } from './BlueprintGrid';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Floating wireframe blocks — abstract UI blocks, not screenshots
function FloatingBlock({
  delay,
  className,
  children,
}: {
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={[
        'gradient-border rounded-xl bg-[#151820] p-4 shadow-[0_2px_16px_rgba(0,0,0,0.32)]',
        !prefersReduced ? 'animate-[agency-float-idle_4s_ease-in-out_infinite]' : '',
        className,
      ].join(' ')}
      style={!prefersReduced ? { animationDelay: `${delay * 0.5}s` } : undefined}
    >
      {children}
    </motion.div>
  );
}

// Stats — values are TODO placeholders
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      {/* TODO: replace with real value when content is ready */}
      <span className="font-display font-bold text-2xl text-[#E8EAF0] tabular-nums">{value}</span>
      <span className="font-mono text-xs text-[#6B7280] mt-0.5">{label}</span>
    </div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export function HeroSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
      aria-label="Главный экран"
    >
      {/* Blueprint grid — desktop only (performance) */}
      <div className="absolute inset-0 hidden sm:block">
        <BlueprintGrid />
      </div>

      {/* Radial gradient overlay — fades grid toward center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(13,15,20,0.0) 0%, rgba(13,15,20,0.6) 60%, rgba(13,15,20,0.95) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-0 lg:min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

          {/* Left: text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-8"
          >
            {/* Label */}
            <motion.div variants={prefersReduced ? undefined : itemVariants}>
              <span className="inline-flex items-center gap-2 font-mono text-xs text-[#00C2A8] border border-[#00C2A8]/30 rounded-full px-3 py-1">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#00C2A8] animate-pulse"
                  aria-hidden="true"
                />
                Digital-агентство полного цикла
              </span>
            </motion.div>

            {/* H1 */}
            <motion.div variants={prefersReduced ? undefined : itemVariants}>
              <h1 className="font-display font-bold text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.08] text-[#E8EAF0] tracking-tight">
                <span className="gradient-text">Строим</span> сайты,
                <br />
                которые работают
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={prefersReduced ? undefined : itemVariants}
              className="font-body text-lg text-[#6B7280] leading-relaxed max-w-xl"
            >
              Разрабатываем лендинги, интернет-магазины и CRM для малого и
              среднего бизнеса. Берём задачу от брифа до запуска — без
              субподрядчиков, без объяснений «почему не так».
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={prefersReduced ? undefined : itemVariants}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#portfolio"
                className="btn-shimmer inline-flex items-center h-12 px-7 rounded-full font-display font-semibold text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9FFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0F14]"
              >
                Смотреть работы
              </a>
              <a
                href="#contacts"
                className="inline-flex items-center h-12 px-7 rounded-full font-display font-semibold text-base text-[#6B9FFF] border border-[#3D7BFF]/40 hover:border-[#3D7BFF]/80 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9FFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0F14]"
              >
                Обсудить проект
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={prefersReduced ? undefined : itemVariants}
              className="flex flex-wrap gap-8 pt-4 border-t border-[#252A3A]"
            >
              {/* TODO: replace with real stats */}
              <StatItem value="50+" label="проектов запущено" />
              <StatItem value="7 лет" label="на рынке" />
              <StatItem value="98%" label="клиентов вернулись" />
            </motion.div>
          </motion.div>

          {/* Right: floating wireframe blocks */}
          <div className="hidden lg:flex flex-col gap-4 items-end relative">

            {/* Block 1 — nav bar wireframe */}
            <FloatingBlock delay={0.5} className="w-72">
              <div className="flex items-center justify-between mb-3">
                <div className="w-16 h-2 rounded bg-[#252A3A]" />
                <div className="flex gap-1.5">
                  <div className="w-8 h-2 rounded bg-[#252A3A]" />
                  <div className="w-8 h-2 rounded bg-[#252A3A]" />
                  <div className="w-12 h-5 rounded-full bg-[#3D7BFF]/30 border border-[#3D7BFF]/40" />
                </div>
              </div>
              <div className="h-px bg-[#252A3A] mb-3" />
              <div className="space-y-2">
                <div className="w-full h-2.5 rounded bg-[#1E2231]" />
                <div className="w-3/4 h-2.5 rounded bg-[#1E2231]" />
              </div>
              <div className="mt-3 flex gap-2">
                <span className="font-mono text-[10px] text-[#00C2A8] bg-[#00C2A8]/10 border border-[#00C2A8]/20 rounded px-2 py-0.5">
                  React
                </span>
                <span className="font-mono text-[10px] text-[#6B9FFF] bg-[#3D7BFF]/10 border border-[#3D7BFF]/20 rounded px-2 py-0.5">
                  TypeScript
                </span>
              </div>
            </FloatingBlock>

            {/* Block 2 — card wireframe */}
            <FloatingBlock delay={0.65} className="w-80">
              <div className="h-24 rounded-lg bg-gradient-to-br from-[#1E2231] to-[#252A3A] mb-3 flex items-center justify-center">
                <div className="w-8 h-8 rounded-md bg-[#3D7BFF]/20 border border-[#3D7BFF]/30" />
              </div>
              <div className="space-y-2">
                <div className="w-1/2 h-3 rounded bg-[#E8EAF0]/20" />
                <div className="w-full h-2 rounded bg-[#1E2231]" />
                <div className="w-5/6 h-2 rounded bg-[#1E2231]" />
              </div>
            </FloatingBlock>

            {/* Block 3 — metric chip */}
            <FloatingBlock delay={0.8} className="w-48 self-start ml-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00C2A8]/15 border border-[#00C2A8]/25 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-[10px] text-[#00C2A8]">↑</span>
                </div>
                <div>
                  <div className="font-display font-bold text-lg text-[#E8EAF0]">+34%</div>
                  <div className="font-mono text-[10px] text-[#6B7280]">конверсия</div>
                </div>
              </div>
            </FloatingBlock>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        aria-hidden="true"
      >
        <span className="font-mono text-xs text-[#6B7280]">scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-[#6B7280] to-transparent"
          animate={prefersReduced ? {} : { scaleY: [1, 0.5, 1] }}
          style={{ originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
