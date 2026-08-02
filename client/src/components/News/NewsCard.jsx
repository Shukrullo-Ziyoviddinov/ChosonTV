import React from 'react';
import { useContentLanguage } from '../../context/ContentLanguageContext';
import './NewsCard.css';

const getLocalized = (value, lang) => {
  if (!value) return '';
  if (typeof value === 'object') {
    return value[lang] || value.uz || value.ru || '';
  }
  return String(value);
};

const pad2 = (n) => String(n).padStart(2, '0');

const NewsCard = ({ item, onReadMore }) => {
  const { contentLang } = useContentLanguage();
  const name = getLocalized(item?.name, contentLang);
  const description = getLocalized(item?.description, contentLang);
  const imgSrc = item?.img ? encodeURI(item.img) : '';
  const day = item?.day;
  const month = item?.month;
  const year = item?.year;

  return (
    <article className="news-card">
      <div className="news-card-media">
        {imgSrc ? (
          <img className="news-card-img" src={imgSrc} alt={name || ''} loading="lazy" />
        ) : (
          <div className="news-card-img news-card-img--empty" />
        )}
        {item?.badge ? <span className="news-card-badge">{item.badge}</span> : null}
      </div>

      <div className="news-card-body">
        {name ? <h3 className="news-card-name">{name}</h3> : null}
        {description ? <p className="news-card-description">{description}</p> : null}

        <div className="news-card-date" aria-label="Sana">
          <span className="news-card-date-item">
            <small>Kun</small>
            <strong>{pad2(day)}</strong>
          </span>
          <span className="news-card-date-sep">/</span>
          <span className="news-card-date-item">
            <small>Oy</small>
            <strong>{pad2(month)}</strong>
          </span>
          <span className="news-card-date-sep">/</span>
          <span className="news-card-date-item">
            <small>Yil</small>
            <strong>{year}</strong>
          </span>
        </div>

        <button
          type="button"
          className="news-card-more"
          onClick={() => onReadMore?.(item)}
        >
          Batafsil o'qish
          <span aria-hidden>→</span>
        </button>
      </div>
    </article>
  );
};

export default NewsCard;
