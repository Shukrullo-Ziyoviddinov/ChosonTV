/**
 * News ko'rishlar: bitta user = bitta news uchun faqat bir marta.
 * Qiymat News schemada saqlanmaydi — User.viewedNews dan hisoblanadi.
 */

const News = require("../models/news");
const User = require("../models/User");

const countNewsViews = async (newsId) => {
  const id = Number(newsId);
  if (!Number.isFinite(id)) return 0;
  return User.countDocuments({ "viewedNews.newsId": id });
};

const getNewsViewCountsMap = async (newsIds = []) => {
  const ids = [...new Set(newsIds.map(Number).filter((id) => Number.isFinite(id) && id > 0))];
  if (!ids.length) return new Map();

  const rows = await User.aggregate([
    { $unwind: "$viewedNews" },
    { $match: { "viewedNews.newsId": { $in: ids } } },
    { $group: { _id: "$viewedNews.newsId", views: { $sum: 1 } } },
  ]);

  return new Map(rows.map((row) => [Number(row._id), Number(row.views) || 0]));
};

const registerNewsView = async ({ user, newsId }) => {
  const id = Number(newsId);
  if (!Number.isFinite(id) || id <= 0) {
    const error = new Error("Noto'g'ri newsId.");
    error.statusCode = 400;
    throw error;
  }

  const news = await News.findOne({ newsId: id }).select("newsId").lean();
  if (!news) {
    const error = new Error("Yangilik topilmadi.");
    error.statusCode = 404;
    throw error;
  }

  const viewedNews = Array.isArray(user.viewedNews) ? user.viewedNews : [];
  const alreadyViewed = viewedNews.some((item) => Number(item.newsId) === id);

  if (alreadyViewed) {
    return {
      newsId: id,
      views: await countNewsViews(id),
      alreadyViewed: true,
      counted: false,
    };
  }

  viewedNews.unshift({
    newsId: id,
    viewedAt: new Date(),
  });

  user.viewedNews = viewedNews.slice(0, 500);
  await user.save();

  return {
    newsId: id,
    views: await countNewsViews(id),
    alreadyViewed: false,
    counted: true,
  };
};

module.exports = {
  registerNewsView,
  countNewsViews,
  getNewsViewCountsMap,
};
