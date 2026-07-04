import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api, type ProjectData } from '../../api/client';
import styles from './Projects.module.css';

export function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const projectsRef = useRef(projects);
  projectsRef.current = projects;
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.projects.list({ limit: '100', admin: 'true' });
      setProjects(data.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function toggleVisibility(id: string, current: boolean) {
    try {
      await api.projects.update(id, { visible: !current });
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Удалить проект "${title}"? Это действие необратимо.`)) return;
    try {
      await api.projects.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...projectsRef.current];
    const [dragged] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, dragged);
    setDragIndex(index);
    setProjects(
      updated.map((p, i) => ({ ...p, order: i }))
    );
  }

  async function handleDragEnd() {
    setDragIndex(null);
    try {
      await api.projects.updateOrder(
        projects.map((p, i) => ({ id: p.id, order: i }))
      );
    } catch {
      setError('Не удалось сохранить порядок. Перезагрузите страницу.');
      loadProjects();
    }
  }

  function moveProject(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const updated = [...projects];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setProjects(updated.map((p, i) => ({ ...p, order: i })));
    api.projects.updateOrder(
      updated.map((p, i) => ({ id: p.id, order: i }))
    ).catch(() => {
      setError('Не удалось сохранить порядок');
      loadProjects();
    });
  }

  if (loading) {
    return <div className={styles.loading}>Загрузка проектов...</div>;
  }

  const categoryLabels: Record<string, string> = {
    ecommerce: 'Магазин',
    landing: 'Лендинг',
    crm: 'CRM',
    corporate: 'Корпоративный',
  };

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>Проекты</h2>
        <Link to="/admin/projects/new" className={styles.addBtn}>
          + Новый проект
        </Link>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          {error}
          <button onClick={() => setError('')} className={styles.errorClose}>✕</button>
        </div>
      )}

      {projects.length === 0 && !loading && (
        <div className={styles.empty}>
          <p>Проектов пока нет</p>
          <Link to="/admin/projects/new" className={styles.addBtn}>
            Создать первый проект
          </Link>
        </div>
      )}

      <div className={styles.list}>
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`${styles.item} ${dragIndex === index ? styles.dragging : ''}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className={styles.dragHandle} aria-label="Перетащить для сортировки">
              <div className={styles.reorderBtns}>
                <button
                  className={styles.reorderBtn}
                  onClick={() => moveProject(index, 'up')}
                  disabled={index === 0}
                  aria-label="Переместить вверх"
                >↑</button>
                <button
                  className={styles.reorderBtn}
                  onClick={() => moveProject(index, 'down')}
                  disabled={index === projects.length - 1}
                  aria-label="Переместить вниз"
                >↓</button>
              </div>
            </div>
            <div className={styles.itemInfo}>
              <div className={styles.itemTitleRow}>
                <span className={styles.itemTitle}>{project.title}</span>
                {project.isComplexSystem && (
                  <span className={styles.complexBadge}>CRM</span>
                )}
                <span className={styles.itemCategory}>
                  {categoryLabels[project.category] || project.category}
                </span>
              </div>
              <p className={styles.itemDesc}>{project.description}</p>
              <span className={styles.itemOrder}>Порядок: {project.order}</span>
            </div>
            <div className={styles.itemActions}>
              <button
                className={`${styles.visToggle} ${project.visible ? styles.visible : styles.hidden}`}
                onClick={() => toggleVisibility(project.id, project.visible)}
                title={project.visible ? 'Скрыть с сайта' : 'Показать на сайте'}
              >
                {project.visible ? 'Видим' : 'Скрыт'}
              </button>
              <Link to={`/admin/projects/${project.id}`} className={styles.editBtn}>
                Изменить
              </Link>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(project.id, project.title)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}