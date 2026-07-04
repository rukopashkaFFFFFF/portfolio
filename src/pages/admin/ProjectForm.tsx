import { useEffect, useState, type FormEvent, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import styles from './ProjectForm.module.css';

const CATEGORIES = [
  { value: 'ecommerce', label: 'Интернет-магазин' },
  { value: 'landing', label: 'Лендинг' },
  { value: 'crm', label: 'CRM' },
  { value: 'corporate', label: 'Корпоративный сайт' },
];

const PREVIEW_TYPES = [
  { value: 'IFRAME', label: 'IFrame (внешний URL)' },
  { value: 'SCREENSHOT', label: 'Скриншоты' },
  { value: 'STATIC_BUNDLE', label: 'Статическая сборка (ZIP)' },
  { value: 'NONE', label: 'Нет превью' },
];

interface FormState {
  title: string;
  description: string;
  category: string;
  tags: string[];
  tagInput: string;
  coverImage: string;
  screenshots: string[];
  liveUrl: string;
  previewType: string;
  isComplexSystem: boolean;
}

const emptyForm: FormState = {
  title: '',
  description: '',
  category: 'landing',
  tags: [],
  tagInput: '',
  coverImage: '',
  screenshots: [],
  liveUrl: '',
  previewType: 'NONE',
  isComplexSystem: false,
};

export function AdminProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingScreen, setUploadingScreen] = useState(false);
  const [uploadingBundle, setUploadingBundle] = useState(false);
  const [bundleName, setBundleName] = useState('');
  const coverInputRef = useRef<HTMLInputElement>(null);
  const screenInputRef = useRef<HTMLInputElement>(null);
  const bundleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    api.projects
      .get(id)
      .then((p) => {
        setForm({
          title: p.title,
          description: p.description,
          category: p.category,
          tags: p.tags,
          tagInput: '',
          coverImage: p.coverImage,
          screenshots: p.screenshots,
          liveUrl: p.liveUrl || '',
          previewType: p.previewType,
          isComplexSystem: p.isComplexSystem,
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, [id]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addTag() {
    const tag = form.tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      update('tags', [...form.tags, tag]);
      update('tagInput', '');
    }
  }

  function removeTag(tag: string) {
    update(
      'tags',
      form.tags.filter((t) => t !== tag)
    );
  }

  async function handleUploadCover(file: File) {
    setUploadingCover(true);
    try {
      const result = await api.upload.file(file);
      update('coverImage', result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки обложки');
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleUploadScreenshot(file: File) {
    setUploadingScreen(true);
    try {
      const result = await api.upload.file(file);
      update('screenshots', [...form.screenshots, result.url]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки скриншота');
    } finally {
      setUploadingScreen(false);
    }
  }

  async function handleUploadBundle(file: File) {
    if (!id && !isEdit) {
      setError('Сначала сохраните проект, затем загрузите сборку');
      return;
    }
    setUploadingBundle(true);
    try {
      const projectId = id!;
      await api.upload.bundle(file, projectId);
      setBundleName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки сборки');
    } finally {
      setUploadingBundle(false);
    }
  }

  function handleDropCover(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUploadCover(file);
  }

  function handleDropScreen(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUploadScreenshot(file);
  }

  function handleDropBundle(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.zip')) {
      handleUploadBundle(file);
    } else {
      setError('Пожалуйста, загрузите ZIP-архив');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.description.trim()) {
      setError('Заполните название и описание проекта');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        tags: form.tags,
        coverImage: form.coverImage,
        screenshots: form.screenshots,
        liveUrl: form.liveUrl.trim() || null,
        previewType: form.previewType as 'IFRAME' | 'SCREENSHOT' | 'STATIC_BUNDLE' | 'NONE',
        isComplexSystem: form.isComplexSystem,
      };

      if (isEdit) {
        await api.projects.update(id!, payload);
      } else {
        const created = await api.projects.create(payload);
        navigate(`/admin/projects/${created.id}`, { replace: true });
        return;
      }
      navigate('/admin/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h2 className={styles.formTitle}>
          {isEdit ? 'Редактировать проект' : 'Новый проект'}
        </h2>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate('/admin/projects')}
          >
            Отмена
          </button>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          {error}
          <button onClick={() => setError('')} className={styles.errorClose}>✕</button>
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.mainCol}>
          {/* Title */}
          <div className={styles.field}>
            <label htmlFor="pf-title" className={styles.label}>Название проекта *</label>
            <input
              id="pf-title"
              className={styles.input}
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Например: Lumi Store"
            />
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label htmlFor="pf-desc" className={styles.label}>Описание *</label>
            <textarea
              id="pf-desc"
              className={styles.textarea}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              placeholder="Краткое описание проекта"
            />
          </div>

          {/* Category + Tags */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="pf-cat" className={styles.label}>Категория</label>
              <select
                id="pf-cat"
                className={styles.select}
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className={styles.field}>
            <label className={styles.label}>Технологии</label>
            <div className={styles.tagInput}>
              <input
                className={styles.input}
                value={form.tagInput}
                onChange={(e) => update('tagInput', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Например: React, Node.js"
              />
              <button type="button" className={styles.tagAddBtn} onClick={addTag}>
                +
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className={styles.tags}>
                {form.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                    <button
                      type="button"
                      className={styles.tagRemove}
                      onClick={() => removeTag(tag)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Live URL */}
          <div className={styles.field}>
            <label htmlFor="pf-url" className={styles.label}>Live URL</label>
            <input
              id="pf-url"
              className={styles.input}
              value={form.liveUrl}
              onChange={(e) => update('liveUrl', e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          {/* Preview Type */}
          <div className={styles.field}>
            <label htmlFor="pf-preview" className={styles.label}>Тип превью</label>
            <select
              id="pf-preview"
              className={styles.select}
              value={form.previewType}
              onChange={(e) => update('previewType', e.target.value)}
            >
              {PREVIEW_TYPES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            {form.isComplexSystem && (
              <p className={styles.hint}>
                Рекомендуем заливать только фронтенд-сборку с демо-данными,
                без подключения к реальной базе.
              </p>
            )}
          </div>

          {/* Complex system checkbox */}
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={form.isComplexSystem}
              onChange={(e) => update('isComplexSystem', e.target.checked)}
            />
            <span>Это сложная система (CRM/личный кабинет)</span>
            <span className={styles.checkboxHint}>
              При выборе рекомендуется тип превью STATIC_BUNDLE
            </span>
          </label>
        </div>

        <div className={styles.sideCol}>
          {/* Cover image */}
          <div className={styles.field}>
            <label className={styles.label}>Обложка</label>
            <div
              className={styles.dropzone}
              onDrop={handleDropCover}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => coverInputRef.current?.click()}
            >
              {form.coverImage ? (
                <img src={form.coverImage} alt="Обложка" className={styles.preview} />
              ) : (
                <p className={styles.dropzoneText}>
                  {uploadingCover ? 'Загрузка...' : 'Нажмите или перетащите изображение'}
                </p>
              )}
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadCover(file);
              }}
            />
          </div>

          {/* Screenshots */}
          <div className={styles.field}>
            <label className={styles.label}>Скриншоты</label>
            <div
              className={styles.dropzone}
              onDrop={handleDropScreen}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => screenInputRef.current?.click()}
            >
              {form.screenshots.length > 0 ? (
                <div className={styles.screenThumbs}>
                  {form.screenshots.map((s, i) => (
                    <div key={i} className={styles.screenThumb}>
                      <img src={s} alt={`Скриншот ${i + 1}`} />
                      <button
                        type="button"
                        className={styles.screenRemove}
                        onClick={(e) => {
                          e.stopPropagation();
                          update('screenshots', form.screenshots.filter((_, j) => j !== i));
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.dropzoneText}>
                  {uploadingScreen ? 'Загрузка...' : 'Нажмите или перетащите скриншоты'}
                </p>
              )}
            </div>
            <input
              ref={screenInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadScreenshot(file);
              }}
            />
          </div>

          {/* Static bundle upload */}
          {form.previewType === 'STATIC_BUNDLE' && (
            <div className={styles.field}>
              <label className={styles.label}>ZIP-архив сборки</label>
              <div
                className={styles.dropzone}
                onDrop={handleDropBundle}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => bundleInputRef.current?.click()}
              >
                {bundleName ? (
                  <p className={styles.dropzoneText}>✓ {bundleName}</p>
                ) : (
                  <p className={styles.dropzoneText}>
                    {uploadingBundle
                      ? 'Распаковка...'
                      : 'Перетащите ZIP-архив или нажмите для выбора'}
                  </p>
                )}
              </div>
              <input
                ref={bundleInputRef}
                type="file"
                accept=".zip"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadBundle(file);
                }}
              />
              <p className={styles.hint}>
                Только фронтенд-сборка с демо-данными (макс. 50 МБ)
              </p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
