import type { ProjectData } from '../api/client';
import { IframePreview } from './IframePreview';
import { StaticBundlePreview } from './StaticBundlePreview';
import { ScreenshotGallery } from './ScreenshotGallery';
import styles from './ProjectPreview.module.css';
import { useCallback } from 'react';

interface ProjectPreviewProps {
  project: ProjectData;
}

export function ProjectPreview({ project }: ProjectPreviewProps) {
  const { previewType, liveUrl, screenshots, id, title } = project;

  const renderNoPreview = useCallback(() => (
    <div className={styles.fallback}>
      <div className={styles.fallbackIcon} aria-hidden="true">🖼</div>
      <p className={styles.fallbackTitle}>Превью не добавлено</p>
      <p className={styles.fallbackText}>
        Для этого проекта пока не загружены скриншоты или демо-сборка.
      </p>
    </div>
  ), []);

  switch (previewType) {
    case 'IFRAME':
      if (!liveUrl) {
        return (
          <div className={styles.fallback}>
            <p className={styles.fallbackTitle}>URL для превью не указан</p>
          </div>
        );
      }
      return (
        <IframePreview
          url={liveUrl}
          label={title}
        />
      );

    case 'STATIC_BUNDLE':
      return <StaticBundlePreview projectId={id} title={title} />;

    case 'SCREENSHOT':
      return <ScreenshotGallery screenshots={screenshots} title={title} />;

    case 'NONE':
    default:
      if (screenshots.length > 0) {
        return <ScreenshotGallery screenshots={screenshots} title={title} />;
      }
      return renderNoPreview();
  }
}