import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { api, type ProjectData } from '../api/client';
import { useHelmet } from '../utils/HelmetProvider';
import styles from './Home.module.css';

export function HomePage() {
  useHelmet({
    title: 'Веб-Решения — создаём сайты, которые продают',
    description: 'Студия веб-разработки полного цикла. Интернет-магазины, лендинги, CRM, корпоративные сайты. Технологично, надёжно, с измеримым результатом.',
  });
  const [featured, setFeatured] = useState<ProjectData[]>([]);

  useEffect(() => {
    api.projects.list({ limit: '3' }).then((data) => {
      setFeatured(data.projects);
    }).catch(() => {
      setFeatured([]);
    });
  }, []);

  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Создаём сайты,<br />
              <span className={styles.heroAccent}>которые продают</span>
            </h1>
            <p className={styles.heroText}>
              Веб-Решения — студия полного цикла. От лендинга до сложной CRM.
              Проектируем, разрабатываем и запускаем цифровые продукты,
              которые приносят бизнесу измеримый результат.
            </p>
            <div className={styles.heroActions}>
              <Button asChild>
                <Link to="/projects">Смотреть портфолио</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/contacts">Обсудить проект</Link>
              </Button>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>50+</span>
              <span className={styles.heroStatLabel}>Завершённых проектов</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>98%</span>
              <span className={styles.heroStatLabel}>Довольных клиентов</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>7 лет</span>
              <span className={styles.heroStatLabel}>На рынке</span>
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.services}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Что мы делаем</h2>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon} aria-hidden="true">🛒</div>
              <h3 className={styles.serviceTitle}>Интернет-магазины</h3>
              <p className={styles.serviceText}>
                Полноценные e-commerce решения с каталогом, корзиной,
                интеграцией платёжных систем и CRM.
              </p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon} aria-hidden="true">🚀</div>
              <h3 className={styles.serviceTitle}>Лендинги и промо</h3>
              <p className={styles.serviceText}>
                Высококонверсионные одностраничные сайты с современным
                дизайном, анимацией и A/B-тестированием.
              </p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon} aria-hidden="true">⚙️</div>
              <h3 className={styles.serviceTitle}>CRM и личные кабинеты</h3>
              <p className={styles.serviceText}>
                Сложные системы управления бизнесом, автоматизация процессов,
                интеграция с 1С и внешними сервисами.
              </p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon} aria-hidden="true">🏢</div>
              <h3 className={styles.serviceTitle}>Корпоративные сайты</h3>
              <p className={styles.serviceText}>
                Представительские порталы с системой управления контентом,
                новостным блоком и порталом для клиентов.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.featured}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Последние работы</h2>
          <div className={styles.projectsGrid}>
            {featured.map((project) => (
              <Card key={project.id} {...project} />
            ))}
          </div>
          <div className={styles.centered}>
            <Button variant="secondary" asChild>
              <Link to="/projects">Все проекты →</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className={`section ${styles.ctaSection}`}>
        <div className="container container--narrow">
          <h2 className={styles.ctaTitle}>Готовы обсудить ваш проект?</h2>
          <p className={styles.ctaText}>
            Расскажите о задаче — мы предложим решение и прикинем смету
            в течение одного рабочего дня.
          </p>
          <Button size="lg" asChild>
            <Link to="/contacts">Связаться с нами</Link>
          </Button>
        </div>
      </section>
    </>
  );
}