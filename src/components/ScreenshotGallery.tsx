import { useState } from 'react';
import styles from './ProjectPreview.module.css';

interface ScreenshotGalleryProps {
  screenshots: string[];
  title: string;
}

export function ScreenshotGallery({ screenshots, title }: ScreenshotGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (screenshots.length === 0) {
    return (
      <div className={styles.fallback}>
        <p className={styles.fallbackTitle}>Скриншоты отсутствуют</p>
      </div>
    );
  }

  const current = screenshots[activeIndex];

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryMain}>
        <img
          src={current}
          alt={`${title} — скриншот ${activeIndex + 1}`}
          className={styles.galleryImage}
        />
      </div>
      {screenshots.length > 1 && (
        <div className={styles.galleryThumbs}>
          {screenshots.map((src, i) => (
            <button
              key={i}
              className={`${styles.thumbBtn} ${i === activeIndex ? styles.thumbActive : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Скриншот ${i + 1}`}
            >
              <img src={src} alt="" className={styles.thumbImage} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
