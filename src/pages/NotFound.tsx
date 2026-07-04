import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useHelmet } from '../utils/HelmetProvider';
import styles from './NotFound.module.css';

export function NotFoundPage() {
  useHelmet({
    title: '404 — Страница не найдена | Веб-Решения',
    description: 'Запрашиваемая страница не найдена. Вернитесь на главную.',
  });
  return (
    <section className={`section ${styles.page}`}>
      <div className="container">
        <div className={styles.content}>
          <span className={styles.code} aria-hidden="true">404</span>
          <h1 className={styles.title}>Страница не найдена</h1>
          <p className={styles.text}>
            Возможно, она была перемещена или удалена.
            Проверьте адрес или вернитесь на главную.
          </p>
          <Button asChild>
            <Link to="/">На главную</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
