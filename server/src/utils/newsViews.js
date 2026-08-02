/**
 * News ko'rishlar: bitta user = bitta news uchun faqat bir marta +1.
 * Ro'yxatdan o'tmagan user hisoblanmaydi (endpoint auth talab qiladi).
 */

const News = require("../models/news");

const registerNewsView = async ({ user, newsId }) => {
  const id = Number(newsId);
  if (!Number.isFinite(id) || id <= 0) {
    const error = new Error("Noto'g'ri newsId.");
    error.statusCode = 400;
    throw error;
  }

  const news = await News.findOne({ newsId: id }).lean();
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
      views: Number(news.views) || 0,
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

  const updated = await News.findOneAndUpdate(
    { newsId: id },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();

  return {
    newsId: id,
    views: Number(updated?.views) || Number(news.views) + 1 || 1,
    alreadyViewed: false,
    counted: true,
  };
};

module.exports = {
  registerNewsView,
};
