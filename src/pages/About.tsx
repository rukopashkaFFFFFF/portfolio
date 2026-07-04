import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useHelmet } from '../utils/HelmetProvider';
import styles from './About.module.css';

export function AboutPage() {
  useHelmet({
    title: 'О компании — Веб-Решения',
    description: 'Студия веб-разработки «Веб-Решения». Команда профессионалов с 7-летним опытом. Узнайте, как мы работаем и чем можем быть полезны.',
  });
  return (
    <section className={`section ${styles.page}`}>
      <div className="container container--narrow">
        <h1 className={styles.title}>О компании</h1>

        <div className={styles.intro}>
          <p className={styles.introText}>
            <strong>Веб-Решения</strong> — студия веб-разработки с фокусом на результат. 
            С 2019 года мы создаём сайты, которые решают бизнес-задачи: 
            увеличивают продажи, автоматизируют процессы, улучшают клиентский сервис.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Как мы работаем</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNumber}>1</span>
              <div>
                <h3 className={styles.stepTitle}>Анализ и стратегия</h3>
                <p className={styles.stepText}>
                  Изучаем ваш бизнес, конкурентов и аудиторию. Формируем техническое 
                  задание и прототип будущего сайта.
                </p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>2</span>
              <div>
                <h3 className={styles.stepTitle}>Дизайн и прототипирование</h3>
                <p className={styles.stepText}>
                  Создаём визуальную концепцию, согласовываем макеты всех экранов 
                  в Figma. Учитываем современные тренды UX/UI.
                </p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>3</span>
              <div>
                <h3 className={styles.stepTitle}>Разработка и интеграция</h3>
                <p className={styles.stepText}>
                  Пишем чистый код, настраиваем бэкенд, базу данных, интеграции 
                  с внешними сервисами. Работаем итерациями с демонстрацией результатов.
                </p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>4</span>
              <div>
                <h3 className={styles.stepTitle}>Запуск и поддержка</h3>
                <p className={styles.stepText}>
                  Разворачиваем на продакшн-сервере, настраиваем аналитику, 
                  SEO и мониторинг. Обеспечиваем техническую поддержку после запуска.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Наша команда</h2>
          <div className={styles.team}>
            <div className={styles.member}>
              <div className={styles.memberAvatar}>П</div>
              <h3 className={styles.memberName}>Павел</h3>
              <p className={styles.memberRole}>Ведущий разработчик</p>
            </div>
            <div className={styles.member}>
              <div className={styles.memberAvatar}>С</div>
              <h3 className={styles.memberName}>Сергей</h3>
              <p className={styles.memberRole}>Full-stack разработчик</p>
            </div>
            <div className={styles.member}>
              <div className={styles.memberAvatar}>К</div>
              <h3 className={styles.memberName}>Кирилл</h3>
              <p className={styles.memberRole}>Frontend-разработчик</p>
            </div>
          </div>
        </div>

        <div className={styles.cta}>
          <h2>Интересно?</h2>
          <p>Расскажите о вашем проекте — мы предложим решение.</p>
          <Button size="lg" asChild>
            <Link to="/contacts">Связаться с нами</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
