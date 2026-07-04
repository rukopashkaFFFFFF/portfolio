import { type ReactNode, createContext, useContext, useEffect, useCallback, useState } from 'react';

interface MetaState {
  title: string;
  description: string;
  ogImage?: string;
}

interface HelmetContextValue {
  setMeta: (meta: Partial<MetaState>) => void;
}

const HelmetContext = createContext<HelmetContextValue>({ setMeta: () => {} });

const defaultMeta: MetaState = {
  title: 'Веб-Решения — создаём сайты, которые продают',
  description:
    'Студия веб-разработки «Веб-Решения». Создаём интернет-магазины, лендинги, CRM и корпоративные сайты. Технологичность, надёжность, измеримый результат.',
  ogImage: '/og-image.png',
};

export function HelmetProvider({ children }: { children: ReactNode }) {
  const [meta, setMetaState] = useState<MetaState>(defaultMeta);

  useEffect(() => {
    document.title = meta.title;
    const setMetaTag = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        if (name.startsWith('og:')) {
          el.setAttribute('property', name);
        } else {
          el.setAttribute('name', name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaTag('description', meta.description);
    setMetaTag('og:title', meta.title);
    setMetaTag('og:description', meta.description);
    setMetaTag('og:type', 'website');
    if (meta.ogImage) setMetaTag('og:image', meta.ogImage);
  }, [meta]);

  const setMeta = useCallback((partial: Partial<MetaState>) => {
    setMetaState((prev) => ({ ...prev, ...partial }));
  }, []);

  return (
    <HelmetContext.Provider value={{ setMeta }}>
      {children}
    </HelmetContext.Provider>
  );
}

export function useHelmet(meta: Partial<MetaState>) {
  const { setMeta } = useContext(HelmetContext);
  useEffect(() => {
    setMeta(meta);
  }, [meta, setMeta]);
}
