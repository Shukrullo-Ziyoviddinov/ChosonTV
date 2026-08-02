import React from 'react';
import { getNewsSection } from './newsData';
import NewsGridCard from './NewsGridCard';
import './NewsGrid.css';

const NewsGrid = ({ onReadMore }) => {
  const items = getNewsSection('yangiliklarGrid');

  if (!items.length) return null;

  return (
    <div className="news-grid">
      {items.map((item) => (
        <NewsGridCard key={item.id} item={item} onReadMore={onReadMore} />
      ))}
    </div>
  );
};

export default NewsGrid;
