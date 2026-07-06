import styles from './ProjectPreview.module.css';

const API_BASE = import.meta.env.VITE_PREVIEW_BASE || 'http://localhost:4000';

interface StaticBundlePreviewProps {
  projectId: string;
  title: string;
}

export function StaticBundlePreview({ projectId, title }: StaticBundlePreviewProps) {
  const previewUrl = `${API_BASE}/preview/${projectId}/index.html`;

  return (
    <div className={styles.bundleWrapper}>
      <div className={styles.demoBanner}>
        <span className={styles.demoIcon} aria-hidden="true">🛡</span>
        <span>Демо-версия с тестовыми данными. Реальная система работает на продакшен-сервере.</span>
      </div>
      <div className={styles.iframeContainer} style={{ maxWidth: '100%' }}>
        <div className={styles.iframeScale}>
          <iframe
            src={previewUrl}
            title={`${title} — демо`}
            className={styles.iframe}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    </div>
  );
}