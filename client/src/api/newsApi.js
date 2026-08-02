import { apiClient } from '../services/apiClient';

const EMPTY_LAYOUT = {
  yangiliklar: [],
  trenddagiYangiliklar: [],
  yangiliklarGrid: [],
};

export const fetchNewsLayout = async ({ active = true } = {}) => {
  const params = new URLSearchParams();
  if (active) params.set('active', '1');

  const data = await apiClient.get(`/api/news/layout?${params.toString()}`, {
    cacheKey: `news:layout:${active ? '1' : '0'}`,
    ttlMs: 60 * 1000,
    dedupeKey: `news:layout:${active ? '1' : '0'}`,
  });

  if (!data || typeof data !== 'object') {
    return { ...EMPTY_LAYOUT };
  }

  return {
    yangiliklar: Array.isArray(data.yangiliklar) ? data.yangiliklar : [],
    trenddagiYangiliklar: Array.isArray(data.trenddagiYangiliklar)
      ? data.trenddagiYangiliklar
      : [],
    yangiliklarGrid: Array.isArray(data.yangiliklarGrid) ? data.yangiliklarGrid : [],
  };
};

export const fetchNews = async ({
  page = 1,
  limit = 20,
  active = true,
  section = '',
} = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (active) params.set('active', '1');
  if (section) params.set('section', section);

  const data = await apiClient.get(`/api/news?${params.toString()}`, {
    cacheKey: `news:${page}:${limit}:${active ? '1' : '0'}:${section || 'all'}`,
    ttlMs: 60 * 1000,
    dedupeKey: `news:${page}:${limit}:${active ? '1' : '0'}:${section || 'all'}`,
  });

  return Array.isArray(data) ? data : [];
};
