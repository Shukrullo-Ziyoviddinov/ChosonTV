import React from 'react';
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
  const name = getLocalized(item?.name, contentLang);
  const description = getLocalized(item?.description, contentLang);
  const imgSrc = item?.img ? encodeURI(item.img) : '';

  return (
    <button
      type="button"
      className="triller-cart"
      onClick={() => onClick?.(item)}
      aria-label={name || 'Triller'}
    >
      <div className="triller-cart-media">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={name || 'Triller'}
            className="triller-cart-img"
            loading="lazy"
          />
        ) : (
          <div className="triller-cart-img triller-cart-img--empty" />
        )}
        <span className="triller-cart-play" aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6 4 20 12 6 20 6 4" />
          </svg>
        </span>
      </div>
      {name ? <p className="triller-cart-name">{name}</p> : null}
      {description ? <p className="triller-cart-description">{description}</p> : null}
    </button>
  );
};

export default TrillerCart;
