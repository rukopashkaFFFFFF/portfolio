import { type FormEvent, useState, useRef } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useHelmet } from '../utils/HelmetProvider';
import { api } from '../api/client';
import styles from './Contacts.module.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const storageKey = 'contact_form_draft';

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = 'Укажите ваше имя';
  if (!data.email.trim()) {
    errors.email = 'Укажите ваш email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Некорректный email';
  }
  if (!data.message.trim()) errors.message = 'Напишите сообщение';
  return errors;
}

function loadDraft(): FormData {
  try {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return { name: '', email: '', phone: '', message: '' };
}

export function ContactsPage() {
  useHelmet({
    title: 'Контакты — Веб-Решения',
    description: 'Свяжитесь со студией «Веб-Решения». Расскажите о проекте — мы предложим решение и предварительную смету.',
  });
  const [form, setForm] = useState<FormData>(loadDraft);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleChange(field: keyof FormData, value: string) {
    const next = { ...form, [field]: value };
    setForm(next);
    sessionStorage.setItem(storageKey, JSON.stringify(next));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    setSending(true);
    try {
      await api.contacts.send({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        message: form.message.trim(),
      });
      setSubmitted(true);
      sessionStorage.removeItem(storageKey);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setErrors({ message: err instanceof Error ? err.message : 'Ошибка отправки. Попробуйте позже.' });
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <section className={`section ${styles.page}`}>
        <div className="container container--narrow">
          <div className={styles.success}>
            <div className={styles.successIcon} aria-hidden="true">✓</div>
            <h1 className={styles.successTitle}>Спасибо за заявку!</h1>
            <p className={styles.successText}>
              Мы получили ваше сообщение и свяжемся с вами в течение одного рабочего дня.
            </p>
            <Button onClick={() => setSubmitted(false)}>
              Отправить ещё
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`section ${styles.page}`}>
      <div className="container container--narrow">
        <h1 className={styles.title}>Свяжитесь с нами</h1>
        <p className={styles.subtitle}>
          Расскажите о задаче — мы предложим решение и предварительную смету.
        </p>

        <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
          <Input
            label="Имя"
            placeholder="Как к вам обращаться?"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            autoComplete="name"
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            label="Телефон (необязательно)"
            type="tel"
            placeholder="+7 (999) 123-45-67"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            autoComplete="tel"
          />
          <div className={styles.field}>
            <label htmlFor="message" className={styles.label}>Сообщение</label>
            <textarea
              id="message"
              className={`${styles.textarea} ${errors.message ? styles.textareaError : ''}`}
              placeholder="Опишите ваш проект, цели и сроки"
              rows={5}
              value={form.message}
              onChange={(e) => handleChange('message', e.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <p id="message-error" className={styles.error} role="alert">
                {errors.message}
              </p>
            )}
          </div>
          <Button type="submit" size="lg" className={styles.submit} disabled={sending}>
            {sending ? 'Отправка...' : 'Отправить'}
          </Button>
        </form>

        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Email</span>
            <a href="mailto:hello@web-resheniya.ru" className={styles.contactValue}>
              hello@web-resheniya.ru
            </a>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Телефон</span>
            <a href="tel:+74951234567" className={styles.contactValue}>
              +7 (495) 123-45-67
            </a>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Адрес</span>
            <span className={styles.contactValue}>
              г. Москва, ул. Тверская, 15
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
