import React from 'react';
import { useContentLanguage } from '../../context/ContentLanguageContext';
import './NewsGridCard.css';

const getLocalized = (value, lang) => {
  if (!value) return '';
  if (typeof value === 'object') {
    return value[lang] || value.uz || value.ru || '';
  }
  return String(value);
};

const pad2 = (n) => String(n).padStart(2, '0');

const formatViews = (value) => {
  const n = Number(value) || 0;
  if (n >= 1000) {
    const k = n / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return String(n);
};

const NewsGridCard = ({ item, onReadMore }) => {
  const { contentLang } = useContentLanguage();
  const name = getLocalized(item?.name, contentLang);
  const description = getLocalized(item?.description, contentLang);
  const imgSrc = item?.img ? encodeURI(item.img) : '';

  return (
    <article className="news-grid-card">
      <div className="news-grid-card-media">
        {imgSrc ? (
          <img className="news-grid-card-img" src={imgSrc} alt={name || ''} loading="lazy" />
        ) : (
          <div className="news-grid-card-img news-grid-card-img--empty" />
        )}
      </div>

      <div className="news-grid-card-body">
        {name ? <h3 className="news-grid-card-name">{name}</h3> : null}
        {description ? (
          <p className="news-grid-card-description">{description}</p>
        ) : null}

        <div className="news-grid-card-meta">
          <span className="news-grid-card-meta-item" title="Sana">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {pad2(item?.day)}.{pad2(item?.month)}.{item?.year}
          </span>
          <span className="news-grid-card-meta-item" title="Ko'rishlar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {formatViews(item?.views)}
          </span>
        </div>

        <button
          type="button"
          className="news-grid-card-more"
          onClick={() => onReadMore?.(item)}
        >
          Batafsil o'qish
          <span aria-hidden>→</span>
        </button>
      </div>
    </article>
  );
};

export default NewsGridCard;
