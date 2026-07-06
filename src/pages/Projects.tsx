import { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { api, type ProjectData } from '../api/client';
import { useHelmet } from '../utils/HelmetProvider';
import styles from './Projects.module.css';

type Category = ProjectData['category'] | 'all';

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: 'Все проекты' },
  { value: 'ecommerce', label: 'Интернет-магазины' },
  { value: 'landing', label: 'Лендинги' },
  { value: 'crm', label: 'CRM' },
  { value: 'corporate', label: 'Корпоративные' },
];

export function ProjectsPage() {
  useHelmet({
    title: 'Портфолио — Веб-Решения',
    description: 'Реальные проекты нашей студии: интернет-магазины, лендинги, CRM, корпоративные сайты. С кейсами, результатами и отзывами.',
  });
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params: Record<string, string> = { limit: '50' };
    if (activeCategory !== 'all') params.category = activeCategory;
    if (searchQuery.trim()) params.search = searchQuery.trim();
    setLoading(true);
    api.projects.list(params).then((data) => {
      setProjects(data.projects);
    }).catch(() => {
      setProjects([]);
    }).finally(() => {
      setLoading(false);
    });
  }, [activeCategory, searchQuery]);

  return (
    <section className={`section ${styles.page}`}>
      <div className="container">
        <h1 className={styles.title}>Портфолио</h1>
        <p className={styles.subtitle}>
          Реальные проекты, которые мы сделали для наших клиентов.
          Каждый кейс — результат командной работы и продуманной стратегии.
        </p>

        <div className={styles.filters}>
          <div className={styles.categories} role="tablist" aria-label="Категории проектов">
            {categories.map((cat) => (
              <button
                key={cat.value}
                role="tab"
                aria-selected={activeCategory === cat.value}
                className={`${styles.categoryBtn} ${activeCategory === cat.value ? styles.categoryActive : ''}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className={styles.search}>
            <Input
              label="Поиск"
              id="project-search"
              placeholder="Название, технология..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Поиск по проектам"
            />
          </div>
        </div>

        {loading ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>Загрузка проектов...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className={styles.grid}>
            {projects.map((project) => (
              <Card key={project.id} {...project} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyText}>
              Проектов по вашему запросу не найдено.
            </p>
            <p className={styles.emptyHint}>
              Попробуйте изменить фильтр или поисковый запрос.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}