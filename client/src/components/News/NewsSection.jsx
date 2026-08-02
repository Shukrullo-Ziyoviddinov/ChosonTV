import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HorizontalScroll from '../HorizontalScroll/HorizontalScroll';
import { fetchNewsLayout } from '../../api/newsApi';
import NewsCard from './NewsCard';
import NewsModal from './NewsModal';
import NewsGrid from './NewsGrid';
import TrendingNews from './TrendingNews';
import './NewsSection.css';

const NewsSection = () => {
  const { i18n } = useTranslation();
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
                    onReadMore={setSelected}
                  />
                ))}
              </HorizontalScroll>
            ) : null}

            <NewsGrid items={grid} onReadMore={setSelected} />
          </div>

          <div className="news-section-sidebar">
            <TrendingNews items={trending} onSelect={setSelected} />
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
