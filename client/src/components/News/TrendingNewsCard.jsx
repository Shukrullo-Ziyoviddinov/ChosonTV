import React from 'react';
import { useContentLanguage } from '../../context/ContentLanguageContext';
import './TrendingNewsCard.css';

const getLocalized = (value, lang) => {
  if (!value) return '';
  if (typeof value === 'object') {
    return value[lang] || value.uz || value.ru || '';
  }
  return String(value);
};

const TrendingNewsCard = ({ item, onClick }) => {
  const { contentLang } = useContentLanguage();
  const name = getLocalized(item?.name, contentLang);
  const description = getLocalized(item?.description, contentLang);
  const imgSrc = item?.img ? encodeURI(item.img) : '';

  return (
    <button
      type="button"
      className="trending-news-card"
      onClick={() => onClick?.(item)}
      aria-label={name || 'Trend yangilik'}
    >
      <div className="trending-news-card-media">
        {imgSrc ? (
          <img className="trending-news-card-img" src={imgSrc} alt="" loading="lazy" />
        ) : (
          <span className="trending-news-card-img trending-news-card-img--empty" />
        )}
        {item?.video ? (
          <span className="trending-news-card-play" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        ) : null}
      </div>

      <div className="trending-news-card-info">
        {name ? <p className="trending-news-card-name">{name}</p> : null}
        {description ? (
          <p className="trending-news-card-description">{description}</p>
        ) : null}
      </div>
    </button>
  );
};

export default TrendingNewsCard;
