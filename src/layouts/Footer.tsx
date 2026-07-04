import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Веб-Решения</h3>
            <p className={styles.colText}>
              Создаём сайты, которые приносят бизнесу результат. 
              Технологичность, надёжность, измеримый эффект.
            </p>
          </div>
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Навигация</h3>
            <Link to="/" className={styles.colLink}>Главная</Link>
            <Link to="/projects" className={styles.colLink}>Портфолио</Link>
            <Link to="/about" className={styles.colLink}>О компании</Link>
            <Link to="/contacts" className={styles.colLink}>Контакты</Link>
          </div>
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Контакты</h3>
            <a href="mailto:hello@web-resheniya.ru" className={styles.colLink}>hello@web-resheniya.ru</a>
            <a href="tel:+74951234567" className={styles.colLink}>+7 (495) 123-45-67</a>
            <p className={styles.colText}>г. Москва, ул. Тверская, 15</p>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Веб-Решения. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
