import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoading } from '../context/LoadingContext';
import Banner from '../components/Banner/Banner';
import Movies from '../components/Movies/Movies';
import {
  useMoviesCatalog,
  HOME_SECTION_LIMIT,
} from '../context/MoviesCatalogContext';
import TopRatedContent from '../components/TopRatedContent/TopRatedContent';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const {
    sections,
    recommendedMovies,
    isLoading: catalogLoading,
    isLoadingMore,
    homeVisibleCount,
    homeHasMoreSections,
    sectionHasMore,
    sectionOrder,
  } = useMoviesCatalog();

  useEffect(() => {
    setLoading('movies', catalogLoading);
    return () => setLoading('movies', false);
  }, [catalogLoading, setLoading]);

  const sectionMeta = useMemo(() => ({
    koreaDrama: { title: t('movies.koreaDrama'), to: '/category/korea' },
    kinolar: { title: t('movies.kinolar'), to: '/category/kinolar' },
    worldMovies: { title: t('movies.worldMovies'), to: '/category/worldMovies' },
    animations: { title: t('movies.animations'), to: '/category/animations' },
    turkishSeries: { title: t('movies.turkishSeries'), to: '/category/turkishSeries' },
    russianMovies: { title: t('movies.russianMovies'), to: '/category/russianMovies' },
    tvSeries: { title: t('movies.tvSeries'), to: '/category/tvSeries' },
    actionMovies: { title: t('movies.actionMovies'), to: '/category/actionMovies' },
    horrorMovies: { title: t('movies.horrorMovies'), to: '/category/horrorMovies' },
    anime: { title: t('movies.anime'), to: '/category/anime' },
    adventureMovies: { title: t('movies.adventureMovies'), to: '/category/adventureMovies' },
    romanceMovies: { title: t('movies.romanceMovies'), to: '/category/romanceMovies' },
    retroMovies: { title: t('movies.retroMovies'), to: '/category/retroMovies' },
    uzbekMovies: { title: t('movies.uzbekMovies'), to: '/category/uzbekMovies' },
  }), [t]);

  const order = sectionOrder?.length ? sectionOrder : [];
  const visibleSectionKeys = order.slice(0, homeVisibleCount);

  const renderedSections = visibleSectionKeys.map((sectionType) => {
    if (sectionType === 'topRated') {
      return (
        <TopRatedContent
          key="top-rated-content"
          limit={HOME_SECTION_LIMIT}
          showHorizontalScroll={true}
          moreTo="/category/topRated"
        />
      );
    }

    const meta = sectionMeta[sectionType];
    const data = sections?.[sectionType] || [];
    const waitingForData = isLoadingMore && data.length === 0 && homeHasMoreSections;

    // Bo'sh bo'lim (haqiqatan 0 kino) — ko'rsatilmaydi
    if (!catalogLoading && !waitingForData && data.length === 0) {
      return null;
    }

    return (
      <Movies
        key={sectionType}
        sectionType={sectionType}
        filteredMovies={data}
        limit={HOME_SECTION_LIMIT}
        showHorizontalScroll={true}
        headerTitle={meta?.title}
        moreTo={meta?.to}
        isLoading={(catalogLoading && data.length === 0) || waitingForData}
        sectionHasMore={Boolean(sectionHasMore?.[sectionType])}
      />
    );
  });

  return (
    <div className="home">
      <Banner />
      <Movies
        sectionType="recommended"
        filteredMovies={recommendedMovies}
        limit={HOME_SECTION_LIMIT}
        showHorizontalScroll={true}
        moreTo="/recommended"
        isLoading={catalogLoading && recommendedMovies.length === 0}
        sectionHasMore={Boolean(sectionHasMore?.recommended)}
      />
      {renderedSections}
      {isLoadingMore && homeHasMoreSections && (
        <div className="home-sections-loading" aria-hidden="true" />
      )}
    </div>
  );
};

export default Home;
