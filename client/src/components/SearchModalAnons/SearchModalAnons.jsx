import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import HorizontalScroll from '../HorizontalScroll/HorizontalScroll';
import ShowMoreButton from '../ShowMoreButton/ShowMoreButton';
import { useMoviesCatalog, HOME_SECTION_LIMIT } from '../../context/MoviesCatalogContext';
import { useContentLanguage } from '../../context/ContentLanguageContext';
import { fetchMoviesCatalog } from '../../api/moviesCatalogApi';
import './SearchModalAnons.css';

const SearchModalAnons = ({ onAnonsClick }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { contentLang } = useContentLanguage();
  const { sections, allMovies } = useMoviesCatalog();
  const [anonsPreview, setAnonsPreview] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchMoviesCatalog({
          page: 1,
          limit: HOME_SECTION_LIMIT,
          section: 'anonslar',
        });
        if (!cancelled) setAnonsPreview(data.allMovies || []);
      } catch (_error) {
        if (!cancelled) setAnonsPreview([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const anonslar = useMemo(() => {
    const map = new Map();
    const push = (item) => {
      if (item?.id == null) return;
      map.set(item.id, item);
    };
    anonsPreview.forEach(push);
    (sections?.anonslar || []).forEach(push);
    (allMovies || []).forEach((movie) => {
      if (movie?.category === 'anonslar' || movie?.categoryName === 'anons') {
        push(movie);
      }
    });
    return Array.from(map.values()).slice(0, HOME_SECTION_LIMIT);
  }, [anonsPreview, sections, allMovies]);
  const getTitle = (item) => {
    if (item.title && typeof item.title === 'object') {
      return item.title[contentLang] || item.title.uz || item.title.ru;
    }
    return item.title || '';
  };

  const getImg = (item) => {
    if (item.homeImg && typeof item.homeImg === 'object') {
      return item.homeImg[contentLang] || item.homeImg.uz || item.homeImg.ru;
    }
    return item.homeImg || item.img || '';
  };

  const handleClick = (item) => {
    if (onAnonsClick) onAnonsClick();
    navigate(`/movie/${item.id}`);
  };

  const handleMoreClick = () => {
    if (onAnonsClick) onAnonsClick();
    navigate('/category/anonslar');
  };

  return (
    <div className="search-modal-anons">
      <div className="search-modal-anons-header">
        <h3 className="search-modal-anons-title">
          {i18n.language === 'ru' ? 'Скоро' : 'Tez kunda'}
        </h3>
        <ShowMoreButton to="/category/anonslar" onClick={handleMoreClick} className="search-modal-anons-more-btn" />
      </div>
      <HorizontalScroll scrollAmount={120}>
        {anonslar.map((item) => (
          <div
            key={item.id}
            className="search-modal-anons-item"
            onClick={() => handleClick(item)}
          >
            <div className="search-modal-anons-item-image-wrapper">
              <img
                src={getImg(item)}
                alt={getTitle(item)}
                className="search-modal-anons-item-image"
              />
              <span className="search-modal-anons-badge search-modal-anons-badge-soon">
                {t('searchModal.tezOrada', 'Tez orada')}
              </span>
              {item.ageRestriction != null && (
                <span className="search-modal-anons-badge search-modal-anons-badge-age">
                  {item.ageRestriction}+
                </span>
              )}
            </div>
          </div>
        ))}
      </HorizontalScroll>
    </div>
  );
};

export default SearchModalAnons;
