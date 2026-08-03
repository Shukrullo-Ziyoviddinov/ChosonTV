import React from 'react';
import LoaderSkeleton from '../LoaderSkeleton/LoaderSkeleton';
import './NewsGridCard.css';
import './NewsGridCardSkeleton.css';

const NewsGridCardSkeleton = () => {
  return (
    <article className="news-grid-card news-grid-card--skeleton" aria-hidden>
      <div className="news-grid-card-media">
        <LoaderSkeleton variant="image" className="news-grid-card-skel-media" />
      </div>

      <div className="news-grid-card-body">
        <LoaderSkeleton
          variant="text"
          className="news-grid-card-skel-name"
          width="90%"
          height={20}
        />
        <LoaderSkeleton
          variant="text"
          className="news-grid-card-skel-description"
          width="100%"
          height={13}
        />
        <LoaderSkeleton
          variant="text"
          className="news-grid-card-skel-description"
          width="82%"
          height={13}
        />

        <div className="news-grid-card-meta news-grid-card-skel-meta">
          <LoaderSkeleton variant="text" width={78} height={13} />
          <LoaderSkeleton variant="text" width={48} height={13} />
        </div>

        <LoaderSkeleton
          variant="button"
          className="news-grid-card-skel-more"
          width={110}
          height={16}
        />
      </div>
    </article>
  );
};

export default NewsGridCardSkeleton;
