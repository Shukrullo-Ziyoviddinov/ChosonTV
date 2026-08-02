import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import HorizontalScroll from '../HorizontalScroll/HorizontalScroll';
import { getNewsSection } from './newsData';
import NewsCard from './NewsCard';
import NewsModal from './NewsModal';
import './NewsSection.css';

const NewsSection = () => {
  const { i18n } = useTranslation();
  const [selected, setSelected] = useState(null);
  const items = getNewsSection('yangiliklar');

  if (!items.length) return null;

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

        <HorizontalScroll scrollAmount={800}>
          {items.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              onReadMore={setSelected}
            />
          ))}
        </HorizontalScroll>
      </div>

      {selected ? (
        <NewsModal item={selected} onClose={() => setSelected(null)} />
      ) : null}
    </section>
  );
};

export default NewsSection;
