# Дизайн-система «Веб-Решения»

## Бренд

- **Название:** Веб-Решения
- **Позиционирование:** «Делаем сайты, которые продают». Технологичность + надёжность. Мы не просто верстаем — мы строим цифровые продукты, которые приносят бизнесу результат.
- **Тон коммуникации:** Уверенный, профессиональный, без пафоса. Акцент на экспертности и измеримых результатах.

## Палитра

| Токен | Значение | Назначение |
|---|---|---|
| `--color-bg-primary` | `#FAFAFE` | Фон страницы (светлая тема) |
| `--color-bg-secondary` | `#F0F0F8` | Фон секций/карточек |
| `--color-bg-elevated` | `#FFFFFF` | Фон модалок/дропдаунов |
| `--color-surface-card` | `#FFFFFF` | Карточки проектов |
| `--color-text-primary` | `#1A1A2E` | Основной текст |
| `--color-text-secondary` | `#5A5A7A` | Вторичный текст |
| `--color-text-on-accent` | `#FFFFFF` | Текст на акцентном фоне |
| `--color-accent` | `#00A8CC` | Основной акцент (технологичность, надёжность) |
| `--color-accent-hover` | `#0095B3` | Ховер акцента |
| `--color-accent-light` | `#E0F7FA` | Фон для акцентных блоков |
| `--color-accent-secondary` | `#FF6B35` | Вторичный акцент (CTA, энергия) |
| `--color-accent-secondary-hover` | `#E55A2B` | Ховер вторичного акцента |
| `--color-border` | `#D8D8E8` | Границы элементов |
| `--color-border-light` | `#E8E8F2` | Слабые границы |
| `--color-success` | `#10B981` | Успех |
| `--color-error` | `#EF4444` | Ошибка |
| `--color-warning` | `#F59E0B` | Предупреждение |

## Типографика

| Свойство | Значение |
|---|---|
| Шрифт заголовков | `Inter` (Google Fonts), sans-serif, weight 600–800 |
| Шрифт текста | `Source Sans 3` (Google Fonts), sans-serif, weight 400–600 |
| Шрифт моно | `JetBrains Mono` для кода |
| Базовая строка | 1.6 |
| Шкала заголовков | 2.5rem / 2rem / 1.5rem / 1.25rem / 1rem |

## Сетка и отступы (8pt grid)

| Токен | Значение |
|---|---|
| `--space-1` | 0.25rem (4px) |
| `--space-2` | 0.5rem (8px) |
| `--space-3` | 0.75rem (12px) |
| `--space-4` | 1rem (16px) |
| `--space-5` | 1.25rem (20px) |
| `--space-6` | 1.5rem (24px) |
| `--space-8` | 2rem (32px) |
| `--space-10` | 2.5rem (40px) |
| `--space-12` | 3rem (48px) |
| `--space-16` | 4rem (64px) |
| `--space-20` | 5rem (80px) |

## Радиусы

| Токен | Значение |
|---|---|
| `--radius-sm` | 4px |
| `--radius-md` | 8px |
| `--radius-lg` | 12px |
| `--radius-xl` | 16px |
| `--radius-full` | 9999px |

## Тени

| Токен | Значение |
|---|---|
| `--shadow-sm` | `0 1px 2px rgba(26, 26, 46, 0.06)` |
| `--shadow-md` | `0 2px 8px rgba(26, 26, 46, 0.08)` |
| `--shadow-lg` | `0 4px 16px rgba(26, 26, 46, 0.10)` |
| `--shadow-xl` | `0 8px 32px rgba(26, 26, 46, 0.12)` |

## Брейкпоинты

- Mobile: 375px
- Tablet: 768px
- Desktop: 1024px
- Wide: 1440px

## Анимации

- `--transition-fast`: 150ms ease
- `--transition-base`: 250ms ease
- `--transition-slow`: 400ms ease

## Компоненты

### Кнопки
- **Primary:** Акцентный фон (`--color-accent`), белый текст, скругление `--radius-md`
- **Secondary:** Прозрачная, обводка `--color-border`, текст `--color-text-primary`
- **Ghost:** Прозрачная, текст `--color-text-secondary`, ховер с фоном
- Размеры: sm (32px), md (40px), lg (48px)
- Фокус-стили: outline с отступом 2px

### Карточки проектов
- Белый фон, `--shadow-md`, `--radius-lg`
- Изображение наверху (16:9 crop), подпись внизу
- Ховер: поднимается тень до `--shadow-lg`, лёгкий translateY(-2px)

### Инпуты форм
- Фон `--color-bg-primary`, обводка `--color-border`
- Фокус: обводка `--color-accent`, тень focus ring
- Placeholder: `--color-text-secondary`
- Error state: обводка `--color-error`

### Бейджи/Теги
- Скругление `--radius-full`, padding 4px 12px
- Варианты: акцентный (фон `--color-accent-light`), серый (фон `--color-bg-secondary`)

### Модалки
- Затемнение фона (rgba(0,0,0,0.5))
- Белая карточка по центру, `--radius-xl`, `--shadow-xl`
- Закрытие по крестику, overlay click, Escape

## Важное напоминание для разработки (previewType)

При работе над страницей проекта и превью — всегда сначала проверять `previewType` проекта:
- `IFRAME` — внешний URL (только если нет X-Frame-Options блокировки)
- `SCREENSHOT` — галерея скриншотов
- `STATIC_BUNDLE` — внутренняя статика из `/uploads/bundles/{id}/`
- `NONE` — просто скриншоты/описание

**Никогда** не пытаться заiframe-ить внешний CRM/личный кабинет напрямую. Для сложных систем (CRM, админки) используйте `STATIC_BUNDLE`.
