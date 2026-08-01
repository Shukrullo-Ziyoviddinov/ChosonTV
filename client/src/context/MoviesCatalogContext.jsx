import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { fetchMoviesCatalog } from '../api/moviesCatalogApi';

const EMPTY_CATALOG = {
  allMovies: [],
  recommendedMovies: [],
  sections: {},
};

const MoviesCatalogContext = createContext({
  ...EMPTY_CATALOG,
  isLoading: true,
  isLoadingMore: false,
  hasMore: false,
  loadMore: async () => {},
  error: null,
});

const mergeUniqueById = (current = [], next = []) => {
  const map = new Map();
  [...current, ...next].forEach((item) => {
    const id = item?.id;
    if (typeof id !== 'undefined') {
      map.set(id, item);
    }
  });
  return Array.from(map.values());
};

const mergeSections = (current = {}, next = {}) => {
  const keys = new Set([...Object.keys(current || {}), ...Object.keys(next || {})]);
  const merged = {};
  keys.forEach((key) => {
    merged[key] = mergeUniqueById(current?.[key] || [], next?.[key] || []);
  });
  return merged;
};

const resolvePageLimit = () => {
  if (typeof window === 'undefined') return 30;
  return window.innerWidth < 768 ? 20 : 30;
};

const shouldLoadMoreByScroll = () => {
  if (typeof window === 'undefined') return false;
  const threshold = 700;
  const scrollBottom = window.innerHeight + window.scrollY;
  const docHeight = document.documentElement.scrollHeight;
  // Pastga yaqinlashganda YOKI sahifa hali scroll bo'lmasa (kontent kalta)
  return scrollBottom >= docHeight - threshold || docHeight <= window.innerHeight + threshold;
};

export const MoviesCatalogProvider = ({ children }) => {
  const [catalog, setCatalog] = useState(EMPTY_CATALOG);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const [pageLimit] = useState(resolvePageLimit);
  const loadingLockRef = useRef(false);

  const loadPage = useCallback(async (targetPage, { append = false } = {}) => {
    const data = await fetchMoviesCatalog({ page: targetPage, limit: pageLimit });
    const nextCatalog = {
      allMovies: data.allMovies || [],
      recommendedMovies: data.recommendedMovies || [],
      sections: data.sections || {},
    };
    const nextMeta = data.meta || {};
    const nextHasMore = Boolean(nextMeta.hasNextPage);

    setCatalog((prev) => {
      if (!append) return nextCatalog;
      return {
        allMovies: mergeUniqueById(prev.allMovies, nextCatalog.allMovies),
        recommendedMovies: mergeUniqueById(prev.recommendedMovies, nextCatalog.recommendedMovies),
        sections: mergeSections(prev.sections, nextCatalog.sections),
      };
    });
    setHasMore(nextHasMore);
    setPage(targetPage);
    setError(null);
    return nextHasMore;
  }, [pageLimit]);

  const loadMore = useCallback(async () => {
    if (loadingLockRef.current || isLoading || isLoadingMore || !hasMore) return;
    loadingLockRef.current = true;
    try {
      setIsLoadingMore(true);
      await loadPage(page + 1, { append: true });
    } catch (err) {
      console.error("[MoviesCatalog] keyingi sahifa xatoligi:", err?.message || err);
      setError(err);
    } finally {
      setIsLoadingMore(false);
      loadingLockRef.current = false;
    }
  }, [hasMore, isLoading, isLoadingMore, loadPage, page]);

  useEffect(() => {
    let isMounted = true;
    const bootstrap = async () => {
      try {
        setIsLoading(true);
        await loadPage(1, { append: false });
      } catch (err) {
        console.error("[MoviesCatalog] API so‘rovi muvaffaqiyatsiz:", err?.message || err);
        if (isMounted) {
          setCatalog(EMPTY_CATALOG);
          setError(err);
          setHasMore(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsBootstrapped(true);
        }
      }
    };
    bootstrap();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll bilan keyingi sahifani yuklash
  useEffect(() => {
    if (!isBootstrapped) return undefined;
    const onScroll = () => {
      if (shouldLoadMoreByScroll()) {
        loadMore();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isBootstrapped, loadMore]);

  // Kontent kalta bo'lsa yoki loader chiqsa — scroll kutmasdan keyingi sahifani yuklash
  useEffect(() => {
    if (!isBootstrapped || !hasMore || isLoading || isLoadingMore) return undefined;
    if (!shouldLoadMoreByScroll()) return undefined;
    const timer = window.setTimeout(() => {
      loadMore();
    }, 80);
    return () => window.clearTimeout(timer);
  }, [catalog, hasMore, isBootstrapped, isLoading, isLoadingMore, loadMore]);

  const value = useMemo(
    () => ({
      ...catalog,
      isLoading,
      isLoadingMore,
      hasMore,
      loadMore,
      error,
    }),
    [catalog, error, hasMore, isLoading, isLoadingMore, loadMore]
  );

  return <MoviesCatalogContext.Provider value={value}>{children}</MoviesCatalogContext.Provider>;
};

export const useMoviesCatalog = () => useContext(MoviesCatalogContext);
