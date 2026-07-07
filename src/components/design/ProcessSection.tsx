import { motion, useReducedMotion } from 'framer-motion';

const STEPS = [
  {
    num: '01',
    title: 'Бриф и аудит',
    text: 'Разбираемся в задаче, конкурентах и ЦА. Формулируем, что именно должен сделать сайт для бизнеса — не «как выглядеть», а «что изменить».',
    duration: '1–2 дня',
  },
  {
    num: '02',
    title: 'Прототип и смета',
    text: 'Показываем структуру страниц до дизайна. Утверждаем состав работ и фиксируем бюджет. Никаких "мы добавим это потом".',
    duration: '2–3 дня',
  },
  {
    num: '03',
    title: 'Дизайн',
    text: 'Три итерации. Первая — общий стиль и главная страница. Вторая — все экраны. Третья — правки. Дальше — код.',
    duration: '5–10 дней',
  },
  {
    num: '04',
    title: 'Разработка',
    text: 'Код, тесты, CI/CD. Вы видите прогресс в закрытой среде каждый день. Правки по дизайну — в рамках согласованного прототипа.',
    duration: '10–30 дней',
  },
  {
    num: '05',
    title: 'Запуск',
    text: 'Деплой, настройка аналитики, обучение вашего редактора. Первый месяц поддержки включён.',
    duration: '1–2 дня',
  },
] as const;

export function ProcessSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="process"
      className="py-24 lg:py-32"
      aria-label="Процесс работы"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p className="font-mono text-xs text-[#00C2A8] uppercase tracking-widest mb-3">Процесс</p>
          <h2 className="font-display font-bold text-[clamp(2rem,4vw,3rem)] text-[#E8EAF0] leading-tight">
            Как мы работаем
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[19px] sm:left-[27px] top-0 bottom-0 w-px bg-[#252A3A]"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-0">
            {STEPS.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.09, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-12 sm:pl-16 pb-10 last:pb-0"
              >
                {/* Step dot */}
                <div
                  className="absolute left-0 top-0 w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-[#0D0F14] border border-[#252A3A]"
                  aria-hidden="true"
                >
                  <span className="font-mono text-xs text-[#3D7BFF]">{step.num}</span>
                </div>

                <div className="pt-2 sm:pt-3">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                    <h3 className="font-display font-semibold text-lg text-[#E8EAF0]">{step.title}</h3>
                    <span className="font-mono text-[10px] text-[#6B7280] border border-[#252A3A] rounded px-2 py-0.5">
                      {step.duration}
                    </span>
                  </div>
                  <p className="font-body text-sm text-[#6B7280] leading-relaxed max-w-2xl">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
