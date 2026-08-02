import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HorizontalScroll from '../HorizontalScroll/HorizontalScroll';
import { fetchNewsLayout, registerNewsView } from '../../api/newsApi';
import { isAuthenticated } from '../../utils/authStorage';
import { useAuthModal } from '../../context/AuthModalContext';
import NewsCard from './NewsCard';
import NewsModal from './NewsModal';
import NewsGrid from './NewsGrid';
import TrendingNews from './TrendingNews';
import './NewsSection.css';

const bumpViewsInLayout = (layout, newsId, views) => {
  const id = Number(newsId);
  const mapSection = (rows) =>
    (Array.isArray(rows) ? rows : []).map((item) => {
      const itemId = Number(item?.id ?? item?.newsId);
      if (itemId !== id) return item;
      return { ...item, views };
    });

  return {
    yangiliklar: mapSection(layout.yangiliklar),
    trenddagiYangiliklar: mapSection(layout.trenddagiYangiliklar),
    yangiliklarGrid: mapSection(layout.yangiliklarGrid),
  };
};

const NewsSection = () => {
  const { i18n } = useTranslation();
  const { openAuthModal } = useAuthModal();
  const [selected, setSelected] = useState(null);
  const [layout, setLayout] = useState({
    yangiliklar: [],
    trenddagiYangiliklar: [],
    yangiliklarGrid: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchNewsLayout({ active: true });
        if (!cancelled) setLayout(data);
      } catch (_error) {
        if (!cancelled) {
          setLayout({
            yangiliklar: [],
            trenddagiYangiliklar: [],
            yangiliklarGrid: [],
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpenNews = async (item) => {
    if (!item) return;

    if (!isAuthenticated()) {
      openAuthModal();
      return;
    }

    setSelected(item);

    const newsId = Number(item.newsId ?? item.id);
    if (!Number.isFinite(newsId)) return;

    try {
      const result = await registerNewsView(newsId);
      if (result?.views == null) return;

      setLayout((prev) => bumpViewsInLayout(prev, newsId, result.views));
      setSelected((prev) =>
        prev && Number(prev.newsId ?? prev.id) === newsId
          ? { ...prev, views: result.views }
          : prev
      );
    } catch (_error) {
      /* ignore — modal ochiq qoladi */
    }
  };

  const featured = layout.yangiliklar;
  const trending = layout.trenddagiYangiliklar;
  const grid = layout.yangiliklarGrid;
  const hasContent = featured.length > 0 || trending.length > 0 || grid.length > 0;

  if (!loading && !hasContent) return null;

  return (
    <section className="news-section">
      <div className="news-section-container">
        <div className="news-section-header">
          <h2 className="news-section-title">
            {i18n.language === 'ru' ? 'Новости' : 'Yangiliklar'}
          </h2>
          <p className="news-section-subtitle">
            {i18n.language === 'ru'
              ? 'Последние новости мира кино, трейлеры, интервью и обзоры.'
              : "Kinolar olamidagi eng so'nggi yangiliklar, treylerlar, intervyular va tahlillar."}
          </p>
        </div>

        <div className="news-section-layout">
          <div className="news-section-main">
            {featured.length > 0 ? (
              <HorizontalScroll scrollAmount={800}>
                {featured.map((item) => (
                  <NewsCard
                    key={item.id || item.newsId}
                    item={item}
                    onReadMore={handleOpenNews}
                  />
                ))}
              </HorizontalScroll>
            ) : null}

            <NewsGrid items={grid} onReadMore={handleOpenNews} />
          </div>

          <div className="news-section-sidebar">
            <TrendingNews items={trending} onSelect={handleOpenNews} />
          </div>
        </div>
      </div>

      {selected ? (
        <NewsModal item={selected} onClose={() => setSelected(null)} />
      ) : null}
    </section>
  );
};

export default NewsSection;
