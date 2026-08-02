import React, { useEffect } from 'react';
import { useContentLanguage } from '../../context/ContentLanguageContext';
import './NewsModal.css';

const getLocalized = (value, lang) => {
  if (!value) return '';
  if (typeof value === 'object') {
    return value[lang] || value.uz || value.ru || '';
  }
  return String(value);
};

const pad2 = (n) => String(n).padStart(2, '0');

const NewsModal = ({ item, onClose }) => {
  const { contentLang } = useContentLanguage();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!item) return null;

  const name = getLocalized(item.name, contentLang);
  const description = getLocalized(item.description, contentLang);
  const imgSrc = item.img ? encodeURI(item.img) : '';
  const videoSrc = item.video ? encodeURI(item.video) : '';
  const hasDate = item.day != null && item.month != null && item.year != null;

  return (
    <div className="news-modal" role="dialog" aria-modal="true" aria-label={name || 'Yangilik'}>
      <button
        type="button"
        className="news-modal-overlay"
        aria-label="Yopish"
        onClick={onClose}
      />
      <div className="news-modal-sheet">
        <button
          type="button"
          className="news-modal-close"
          onClick={onClose}
          aria-label="Yopish"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="news-modal-media">
          {videoSrc ? (
            <video
              className="news-modal-video"
              src={videoSrc}
              controls
              playsInline
              autoPlay
              poster={imgSrc || undefined}
            />
          ) : imgSrc ? (
            <img className="news-modal-img" src={imgSrc} alt={name || ''} />
          ) : (
            <div className="news-modal-img news-modal-img--empty" />
          )}
        </div>

        <div className="news-modal-body">
          {name ? <h3 className="news-modal-name">{name}</h3> : null}

          {hasDate ? (
            <div className="news-modal-date">
              <span>{pad2(item.day)}</span>
              <span>/</span>
              <span>{pad2(item.month)}</span>
              <span>/</span>
              <span>{item.year}</span>
            </div>
          ) : null}

          {description ? (
            <p className="news-modal-description">{description}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
