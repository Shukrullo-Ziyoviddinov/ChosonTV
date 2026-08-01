import React, { useRef } from 'react';
import { useContentLanguage } from '../../context/ContentLanguageContext';
import './TrillerCart.css';

const getLocalized = (value, lang) => {
  if (!value) return '';
  if (typeof value === 'object') {
    return value[lang] || value.uz || value.ru || '';
  }
  return String(value);
};

const TrillerCart = ({ item, onClick }) => {
  const { contentLang } = useContentLanguage();
  const videoRef = useRef(null);
  const name = getLocalized(item?.name, contentLang);

  return (
    <button
      type="button"
      className="triller-cart"
      onClick={() => onClick?.(item)}
      aria-label={name || 'Triller'}
    >
      <div className="triller-cart-media">
        <video
          ref={videoRef}
          className="triller-cart-video"
          src={item?.trillerVideo || ''}
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
        />
        <span className="triller-cart-play" aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6 4 20 12 6 20 6 4" />
          </svg>
        </span>
      </div>
      {name ? <p className="triller-cart-name">{name}</p> : null}
    </button>
  );
};

export default TrillerCart;
