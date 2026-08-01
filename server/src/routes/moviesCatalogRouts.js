const express = require("express");
const Movie = require("../models/movies");
const User = require("../models/User");
const {
  buildMoviesCatalog,
  SECTION_TO_CATEGORY_NAMES,
} = require("../utils/moviesCatalogTransform");
const { success } = require("../utils/apiResponse");
const { parsePagination, buildPaginationMeta } = require("../utils/pagination");
const { applyPagination } = require("../utils/queryOptimizer");
const { verifyToken } = require("../utils/token");

const router = express.Router();

const normalizeMovie = ({ _id, movieId, createdAt, updatedAt, ...movie }) => ({
  ...movie,
  id: movie.id || movieId,
});

const resolveOptionalUser = async (req) => {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) return null;
  try {
    const payload = verifyToken(token);
    if (!payload?.userId) return null;
    return await User.findById(payload.userId).lean();
  } catch (_error) {
    return null;
  }
};

const loadPopularMovieScores = async () => {
  const rows = await User.aggregate([
    { $unwind: { path: "$viewedMovies", preserveNullAndEmptyArrays: false } },
    {
      $group: {
        _id: "$viewedMovies.movieId",
        totalViews: { $sum: { $ifNull: ["$viewedMovies.viewCount", 1] } },
        uniqueUsers: { $sum: 1 },
      },
    },
    { $sort: { totalViews: -1, uniqueUsers: -1 } },
    { $limit: 200 },
  ]);

  const maxViews = rows.length ? Math.max(...rows.map((row) => Number(row.totalViews) || 0), 1) : 1;
  const scores = new Map();
  rows.forEach((row) => {
    const movieId = Number(row?._id);
    if (!Number.isFinite(movieId)) return;
    const totalViews = Number(row?.totalViews) || 0;
    const uniqueUsers = Number(row?.uniqueUsers) || 0;
    const normalizedViews = totalViews / maxViews;
    const uniquenessBoost = Math.min(uniqueUsers / 10, 1) * 0.2;
    scores.set(movieId, normalizedViews + uniquenessBoost);
  });
  return scores;
};

const resolveSectionQuery = (raw) => {
  const section = String(raw || "").trim();
  if (!section) return null;
  if (section === "korea") return "koreaDrama";
  if (section === "recommended") return "recommended";
  if (SECTION_TO_CATEGORY_NAMES[section]) return section;
  return null;
};

router.get("/", async (req, res, next) => {
  try {
    const pagination = parsePagination(req.query);
    const section = resolveSectionQuery(req.query.section);
    const user = await resolveOptionalUser(req);
    const popularMovieScores = await loadPopularMovieScores();

    // Tavsiya: avval kerakli recommended ro'yxat, keyin scroll pagination
    if (section === "recommended") {
      const rawMovies = await Movie.find().sort({ movieId: 1 }).select("-__v").lean();
      const movies = rawMovies.map(normalizeMovie);
      const catalog = buildMoviesCatalog(movies, { user, popularMovieScores });
      const recommended = catalog.recommendedMovies || [];
      const pageItems = recommended.slice(
        pagination.skip,
        pagination.skip + pagination.limit
      );
      return success(
        res,
        {
          allMovies: pageItems,
          recommendedMovies: pageItems,
          sections: {},
        },
        "Katalog ma'lumotlari",
        200,
        buildPaginationMeta(recommended.length, pagination)
      );
    }

    // Bo'lim: avval shu section kinolari, keyin scroll bilan qolgani
    if (section) {
      const categoryNames = SECTION_TO_CATEGORY_NAMES[section] || [];
      const filter = { categoryName: { $in: categoryNames } };
      const total = await Movie.countDocuments(filter);
      const rawMovies = await applyPagination(
        Movie.find(filter).sort({ movieId: 1 }).select("-__v"),
        pagination
      ).lean();
      const movies = rawMovies.map(normalizeMovie);
      const catalog = buildMoviesCatalog(movies, { user, popularMovieScores });
      return success(
        res,
        {
          allMovies: catalog.allMovies,
          recommendedMovies: catalog.recommendedMovies,
          sections: catalog.sections,
        },
        "Katalog ma'lumotlari",
        200,
        buildPaginationMeta(total, pagination)
      );
    }

    // Umumiy katalog (home) — sahifalab
    const total = await Movie.countDocuments();
    const rawMovies = await applyPagination(
      Movie.find().sort({ movieId: 1 }).select("-__v"),
      pagination
    ).lean();
    const movies = rawMovies.map(normalizeMovie);
    const payload = buildMoviesCatalog(movies, { user, popularMovieScores });
    return success(
      res,
      payload,
      "Katalog ma'lumotlari",
      200,
      buildPaginationMeta(total, pagination)
    );
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
