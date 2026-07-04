import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ProjectPreview } from '../components/ProjectPreview';
import { useHelmet } from '../utils/HelmetProvider';
import styles from './ProjectDetail.module.css';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  useHelmet({
    title: project ? `${project.title} — Портфолио Веб-Решения` : 'Проект не найден — Веб-Решения',
    description: project?.fullDescription || '',
  });

  if (!project) {
    return (
      <section className={`section ${styles.page}`}>
        <div className="container container--narrow">
          <h1 className={styles.notFoundTitle}>Проект не найден</h1>
          <p className={styles.notFoundText}>
            Возможно, он был удалён или ссылка некорректна.
          </p>
          <Button asChild>
            <Link to="/projects">← Назад к портфолио</Link>
          </Button>
        </div>
      </section>
    );
  }

  const categoryLabels: Record<string, string> = {
    ecommerce: 'Интернет-магазин',
    landing: 'Лендинг',
    crm: 'CRM',
    corporate: 'Корпоративный сайт',
  };

  return (
    <section className={`section ${styles.page}`}>
      <div className="container">
        <Link to="/projects" className={styles.back}>
          ← Назад к портфолио
        </Link>

        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <Badge variant="accent">{categoryLabels[project.category] || project.category}</Badge>
            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.meta}>
              Клиент: {project.client} &middot; {project.year}
            </p>
          </div>
          {project.liveUrl && project.previewType !== 'STATIC_BUNDLE' && (
            <Button variant="secondary" asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                Открыть сайт →
              </a>
            </Button>
          )}
        </div>

        {/* Live preview */}
        <div className={styles.previewSection}>
          <ProjectPreview project={project} />
        </div>

        <div className={styles.content}>
          <div className={styles.description}>
            <h2>О проекте</h2>
            <p>{project.fullDescription}</p>

            <div className={styles.tags}>
              <h3>Использованные технологии</h3>
              <div className={styles.tagsList}>
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="accent">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <h2>Результаты</h2>
            <ul className={styles.resultsList}>
              {project.results.map((result, i) => (
                <li key={i} className={styles.resultItem}>
                  <span className={styles.resultCheck} aria-hidden="true">✓</span>
                  {result}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
