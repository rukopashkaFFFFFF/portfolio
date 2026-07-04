import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useHelmet } from '../utils/HelmetProvider';
import styles from './Error.module.css';

export function ErrorPage() {
  useHelmet({
    title: 'Ошибка сервера — Веб-Решения',
    description: 'Временно недоступно. Попробуйте обновить страницу позже.',
  });

  return (
    <section className={`section ${styles.page}`}>
      <div className="container">
        <div className={styles.content}>
          <span className={styles.code} aria-hidden="true">500</span>
          <h1 className={styles.title}>Временная ошибка</h1>
          <p className={styles.text}>
            Что-то пошло не так. Мы уже знаем об этом и исправляем.
            Попробуйте обновить страницу через несколько минут.
          </p>
          <div className={styles.actions}>
            <Button onClick={() => window.location.reload()}>
              Обновить страницу
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/">На главную</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
