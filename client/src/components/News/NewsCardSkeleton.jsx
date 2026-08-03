import React from 'react';
import LoaderSkeleton from '../LoaderSkeleton/LoaderSkeleton';
import './NewsCard.css';
import './NewsCardSkeleton.css';

const NewsCardSkeleton = () => {
  return (
    <article className="news-card news-card--skeleton" aria-hidden>
      <div className="news-card-media">
        <LoaderSkeleton variant="image" className="news-card-skel-media" />
      </div>

      <div className="news-card-body">
        <LoaderSkeleton
          variant="text"
          className="news-card-skel-name"
          width="88%"
          height={22}
        />
        <LoaderSkeleton
          variant="text"
          className="news-card-skel-description"
          width="100%"
          height={14}
        />
        <LoaderSkeleton
          variant="text"
          className="news-card-skel-description"
          width="96%"
          height={14}
        />
        <LoaderSkeleton
          variant="text"
          className="news-card-skel-description"
          width="90%"
          height={14}
        />
        <LoaderSkeleton
          variant="text"
          className="news-card-skel-description"
          width="84%"
          height={14}
        />
        <LoaderSkeleton
          variant="text"
          className="news-card-skel-description news-card-skel-description--last"
          width="72%"
          height={14}
        />

        <div className="news-card-date news-card-skel-date">
          <LoaderSkeleton variant="text" width={88} height={14} />
          <LoaderSkeleton variant="text" width={54} height={14} />
        </div>

        <LoaderSkeleton
          variant="button"
          className="news-card-skel-more"
          width={120}
          height={18}
        />
      </div>
    </article>
  );
};

export default NewsCardSkeleton;
