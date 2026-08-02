import React from 'react';
import NewsGridCard from './NewsGridCard';
import './NewsGrid.css';

const NewsGrid = ({ items = [], onReadMore }) => {
  if (!items.length) return null;

  return (
    <div className="news-grid">
      {items.map((item) => (
        <NewsGridCard
          key={item.id || item.newsId}
          item={item}
          onReadMore={onReadMore}
        />
      ))}
    </div>
  );
};

export default NewsGrid;
