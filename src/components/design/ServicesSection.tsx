import { motion, useReducedMotion } from 'framer-motion';

const SERVICES = [
  {
    id: 'ecommerce',
    mono: '01',
    title: 'Интернет-магазин',
    text: 'Полноценный e-commerce: каталог, корзина, оплата, интеграция с 1С или складской системой. Делаем под нагрузку — не рассыпется в Чёрную пятницу.',
    tags: ['Next.js', 'PostgreSQL', 'Stripe / ЮKassa'],
  },
  {
    id: 'landing',
    mono: '02',
    title: 'Лендинг и промо',
    text: 'Сайт, который объясняет продукт и конвертит посетителей в заявки. Без воды в текстах и без шаблонных секций «Почему мы».',
    tags: ['React', 'Vite', 'Анимации'],
  },
  {
    id: 'crm',
    mono: '03',
    title: 'CRM и SaaS',
    text: 'Внутренние системы, которые реально использует команда: простые интерфейсы, понятная логика, интеграции с тем, что уже есть.',
    tags: ['React', 'Node.js', 'Роли и права'],
  },
  {
    id: 'corporate',
    mono: '04',
    title: 'Корпоративный портал',
    text: 'Представительский сайт с CMS, который редактирует маркетолог без звонка разработчику. Работает быстро, выглядит надёжно.',
    tags: ['Next.js', 'CMS', 'SEO'],
  },
] as const;

export function ServicesSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="services"
      className="py-24 lg:py-32 bg-[#151820]"
      aria-label="Услуги"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p className="font-mono text-xs text-[#00C2A8] uppercase tracking-widest mb-3">Услуги</p>
          <h2 className="font-display font-bold text-[clamp(2rem,4vw,3rem)] text-[#E8EAF0] leading-tight">
            Что мы делаем
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-px bg-[#252A3A]">
          {SERVICES.map((svc, idx) => (
            <motion.div
              key={svc.id}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#151820] p-8 flex flex-col gap-4 group hover:bg-[#1E2231] transition-colors duration-300"
            >
              <span className="font-mono text-xs text-[#3D7BFF]/60">{svc.mono}</span>
              <h3 className="font-display font-semibold text-xl text-[#E8EAF0]">{svc.title}</h3>
              <p className="font-body text-sm text-[#6B7280] leading-relaxed flex-1">{svc.text}</p>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#252A3A]">
                {svc.tags.map((tag) => (
                  <span key={tag} className="font-mono text-[10px] text-[#6B7280] bg-[#0D0F14] border border-[#252A3A] rounded px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
