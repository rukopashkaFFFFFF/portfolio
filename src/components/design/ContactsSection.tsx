import { useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { api } from '../../api/client';

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const EMPTY: FormState = { name: '', email: '', phone: '', message: '' };

function Field({
  label,
  id,
  required,
  error,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-xs text-[#6B7280] uppercase tracking-wider">
        {label}{required && <span className="text-[#F87171] ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && <span role="alert" className="font-mono text-xs text-[#F87171]">{error}</span>}
    </div>
  );
}

const inputClass = [
  'bg-[#151820] border border-[#252A3A] rounded-lg px-4 py-3',
  'font-body text-sm text-[#E8EAF0] placeholder:text-[#6B7280]',
  'focus:outline-none focus:border-[#3D7BFF]/60 focus:ring-1 focus:ring-[#3D7BFF]/40',
  'transition-colors duration-200',
].join(' ');

function validate(f: FormState): Partial<Record<keyof FormState, string>> {
  const err: Partial<Record<keyof FormState, string>> = {};
  if (!f.name.trim())    err.name    = 'Укажите имя';
  if (!f.email.trim())   err.email   = 'Укажите email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) err.email = 'Некорректный email';
  if (!f.message.trim()) err.message = 'Напишите сообщение';
  return err;
}

export function ContactsSection() {
  const prefersReduced = useReducedMotion();
  const [form, setForm]       = useState<FormState>(EMPTY);
  const [errors, setErrors]   = useState<Partial<Record<keyof FormState, string>>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [apiError, setApiError] = useState('');

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      setErrors(prev => ({ ...prev, [field]: undefined }));
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSending(true);
    setApiError('');
    try {
      await api.contacts.send({
        name:    form.name.trim(),
        email:   form.email.trim(),
        phone:   form.phone.trim() || undefined,
        message: form.message.trim(),
      });
      setSent(true);
      setForm(EMPTY);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Ошибка отправки. Попробуйте позже.');
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      id="contacts"
      className="py-24 lg:py-32 bg-[#151820]"
      aria-label="Контакты"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-xs text-[#00C2A8] uppercase tracking-widest mb-3">Контакты</p>
            <h2 className="font-display font-bold text-[clamp(2rem,4vw,3rem)] text-[#E8EAF0] leading-tight mb-6">
              Расскажите о задаче
            </h2>
            <p className="font-body text-base text-[#6B7280] leading-relaxed mb-10 max-w-md">
              Заполните форму — мы ответим в течение рабочего дня.
              Опишите задачу как умеете: чем конкретнее, тем точнее оценим сроки и бюджет.
            </p>

            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#3D7BFF]/10 border border-[#3D7BFF]/20 flex items-center justify-center flex-shrink-0 font-mono text-xs text-[#6B9FFF]" aria-hidden="true">@</span>
                <a href="mailto:hello@web-resheniya.ru" className="font-body text-sm text-[#6B9FFF] hover:text-[#E8EAF0] transition-colors">
                  hello@web-resheniya.ru
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#00C2A8]/10 border border-[#00C2A8]/20 flex items-center justify-center flex-shrink-0 font-mono text-xs text-[#00C2A8]" aria-hidden="true">t</span>
                <a href="https://t.me/web_resheniya" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-[#6B9FFF] hover:text-[#E8EAF0] transition-colors">
                  @web_resheniya в Telegram
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {sent ? (
              <div className="gradient-border rounded-xl bg-[#0D0F14] p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[#00C2A8]/15 border border-[#00C2A8]/30 flex items-center justify-center mx-auto mb-4">
                  <span className="font-mono text-lg text-[#00C2A8]" aria-hidden="true">✓</span>
                </div>
                <h3 className="font-display font-semibold text-lg text-[#E8EAF0] mb-2">Заявка отправлена</h3>
                <p className="font-body text-sm text-[#6B7280]">
                  Свяжемся с вами в течение рабочего дня.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 font-mono text-xs text-[#6B9FFF] hover:text-[#E8EAF0] transition-colors underline underline-offset-2"
                >
                  Отправить ещё одну заявку
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-5"
                aria-label="Форма обратной связи"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Имя" id="ds-name" required error={errors.name}>
                    <input
                      id="ds-name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={set('name')}
                      placeholder="Александр"
                      className={inputClass}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                    />
                  </Field>
                  <Field label="Email" id="ds-email" required error={errors.email}>
                    <input
                      id="ds-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={set('email')}
                      placeholder="you@company.ru"
                      className={inputClass}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                    />
                  </Field>
                </div>

                <Field label="Телефон" id="ds-phone">
                  <input
                    id="ds-phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="+7 999 000 00 00"
                    className={inputClass}
                  />
                </Field>

                <Field label="Задача" id="ds-message" required error={errors.message}>
                  <textarea
                    id="ds-message"
                    rows={4}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Что нужно сделать, какой дедлайн, есть ли бюджет..."
                    className={inputClass + ' resize-none'}
                    aria-required="true"
                    aria-invalid={!!errors.message}
                  />
                </Field>

                {apiError && (
                  <p role="alert" className="font-mono text-xs text-[#F87171] bg-[#F87171]/08 border border-[#F87171]/20 rounded-lg px-4 py-3">
                    {apiError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-shimmer self-start h-12 px-8 rounded-full font-display font-semibold text-base text-white disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9FFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#151820]"
                >
                  {sending ? 'Отправляем...' : 'Отправить заявку'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
