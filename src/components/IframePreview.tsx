import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ProjectPreview.module.css';

interface IframePreviewProps {
  url: string;
  label: string;
  onError?: () => void;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const viewportConfig: Record<ViewportSize, { width: number; label: string }> = {
  desktop: { width: 100, label: 'Desktop' },
  tablet: { width: 768, label: 'Tablet' },
  mobile: { width: 375, label: 'Mobile' },
};

export function IframePreview({ url, label, onError }: IframePreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleError = useCallback(() => {
    setError(true);
    onError?.();
  }, [onError]);

  useEffect(() => {
    setError(false);
    setLoaded(false);

    timeoutRef.current = setTimeout(() => {
      if (!loaded) {
        handleError();
      }
    }, 10000);

    return () => {
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    };
  }, [url, loaded, handleError]);

  if (error) {
    return (
      <div className={styles.fallback}>
        <div className={styles.fallbackIcon} aria-hidden="true">⚠</div>
        <p className={styles.fallbackTitle}>Превью недоступно для встраивания</p>
        <p className={styles.fallbackText}>
          Сайт заблокировал отображение в iframe (X-Frame-Options).
          Вы можете открыть его по прямой ссылке.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.fallbackLink}
        >
          Открыть в новой вкладке →
        </a>
      </div>
    );
  }

  const config = viewportConfig[viewport];
  const containerWidth = config.width === 100 ? '100%' : `${config.width}px`;

  return (
    <div className={styles.iframeWrapper}>
      <div className={styles.toolbar}>
        <div className={styles.viewportBtns}>
          {(Object.entries(viewportConfig) as [ViewportSize, typeof viewportConfig['desktop']][]).map(
            ([key, cfg]) => (
              <button
                key={key}
                className={`${styles.viewportBtn} ${viewport === key ? styles.viewportActive : ''}`}
                onClick={() => setViewport(key)}
                aria-label={`Вид ${cfg.label}`}
              >
                {cfg.label}
              </button>
            )
          )}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.openLink}
          title="Открыть в новой вкладке"
        >
          ↗
        </a>
      </div>
      <div className={styles.iframeContainer} style={{ maxWidth: containerWidth }}>
        <div className={styles.iframeScale}>
          <iframe
            src={url}
            title={label}
            className={styles.iframe}
            onLoad={() => {
              setLoaded(true);
              if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
            }}
            onError={handleError}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            allow="clipboard-read; clipboard-write"
          />
        </div>
      </div>
    </div>
  );
}
