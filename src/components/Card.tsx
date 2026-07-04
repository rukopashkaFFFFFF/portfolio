import { Link } from 'react-router-dom';
import { Badge } from './Badge';
import styles from './Card.module.css';

interface CardProps {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  tags: string[];
  category: string;
}

export function Card({ id, title, description, coverImage, tags }: CardProps) {
  return (
    <article className={styles.card}>
      <Link to={`/projects/${id}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <img
            src={coverImage || '/placeholder-project.svg'}
            alt={`Превью проекта ${title}`}
            className={styles.image}
            loading="lazy"
          />
        </div>
        <div className={styles.body}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <div className={styles.tags}>
            {tags.map((tag) => (
              <Badge key={tag} variant="neutral">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
