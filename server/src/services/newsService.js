const News = require("../models/news");
const { NEWS_SECTIONS } = require("../models/news");

const toPublicNews = (row) => {
  if (!row) return null;
  const { _id, createdAt, updatedAt, ...rest } = row;
  return {
    ...rest,
    id: rest.newsId,
    createdAt,
    updatedAt,
  };
};

const normalizeLocalized = (value, fallback = "") => {
  if (value && typeof value === "object") {
    return {
      uz: String(value.uz || "").trim(),
      ru: String(value.ru || "").trim(),
    };
  }
  if (typeof value === "string") {
    return { uz: value.trim(), ru: "" };
  }
  return { uz: String(fallback || "").trim(), ru: "" };
};

const buildNewsPayload = (payload = {}, { requireSection = false } = {}) => {
  const next = {};

  if (payload.section !== undefined || requireSection) {
    next.section = String(payload.section || "").trim();
  }
  if (payload.name !== undefined || payload.Name !== undefined) {
    next.name = normalizeLocalized(payload.name ?? payload.Name);
  }
  if (payload.description !== undefined) {
    next.description = normalizeLocalized(payload.description);
  }
  if (payload.img !== undefined) {
    next.img = String(payload.img || "").trim();
  }
  if (payload.video !== undefined) {
    next.video = String(payload.video || "").trim();
  }
  if (payload.views !== undefined) {
    const views = Number(payload.views);
    next.views = Number.isFinite(views) && views >= 0 ? views : 0;
  }
  if (payload.isActive !== undefined) {
    next.isActive = payload.isActive !== false && payload.isActive !== "false" && payload.isActive !== 0;
  }
  if (payload.sortOrder !== undefined) {
    const sortOrder = Number(payload.sortOrder);
    if (Number.isFinite(sortOrder)) next.sortOrder = sortOrder;
  }

  return next;
};

const listNews = async ({
  skip = 0,
  limit = 30,
  activeOnly = false,
  section = "",
} = {}) => {
  const filter = {};
  if (activeOnly) filter.isActive = true;
  if (section && NEWS_SECTIONS.includes(section)) {
    filter.section = section;
  }

  const [total, rows] = await Promise.all([
    News.countDocuments(filter),
    News.find(filter)
      .sort({ sortOrder: 1, newsId: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return {
    items: rows.map(toPublicNews),
    total,
  };
};

const getNewsLayout = async ({ activeOnly = true } = {}) => {
  const filter = activeOnly ? { isActive: true } : {};
  const rows = await News.find(filter).sort({ sortOrder: 1, newsId: 1 }).lean();
  const items = rows.map(toPublicNews);

  const layout = {
    yangiliklar: [],
    trenddagiYangiliklar: [],
    yangiliklarGrid: [],
  };

  for (const item of items) {
    if (layout[item.section]) {
      layout[item.section].push(item);
    }
  }

  return layout;
};

const getNewsById = async (newsId) => {
  const row = await News.findOne({ newsId }).lean();
  return toPublicNews(row);
};

const createNews = async (payload = {}) => {
  let nextId = Number(payload.newsId);
  if (!Number.isFinite(nextId) || nextId <= 0) {
    const last = await News.findOne().sort({ newsId: -1 }).select("newsId").lean();
    nextId = Number(last?.newsId || 0) + 1;
  }

  const data = buildNewsPayload(payload, { requireSection: true });
  if (!NEWS_SECTIONS.includes(data.section)) {
    const error = new Error("Noto'g'ri section.");
    error.statusCode = 400;
    throw error;
  }
  if (!data.name?.uz) {
    const error = new Error("name.uz majburiy.");
    error.statusCode = 400;
    throw error;
  }

  const created = await News.create({
    newsId: nextId,
    section: data.section,
    name: data.name,
    description: data.description || { uz: "", ru: "" },
    img: data.img || "",
    video: data.video || "",
    views: data.views || 0,
    isActive: data.isActive !== false,
    sortOrder: Number.isFinite(data.sortOrder) ? data.sortOrder : nextId,
  });

  return toPublicNews(created.toObject());
};

const updateNews = async (newsId, payload = {}) => {
  const data = buildNewsPayload(payload);
  if (data.section !== undefined && !NEWS_SECTIONS.includes(data.section)) {
    const error = new Error("Noto'g'ri section.");
    error.statusCode = 400;
    throw error;
  }

  const updated = await News.findOneAndUpdate(
    { newsId },
    { $set: data },
    { new: true, runValidators: true }
  ).lean();

  return toPublicNews(updated);
};

const deleteNews = async (newsId) => {
  const deleted = await News.findOneAndDelete({ newsId }).lean();
  return toPublicNews(deleted);
};

module.exports = {
  NEWS_SECTIONS,
  listNews,
  getNewsLayout,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  toPublicNews,
};
