require("dotenv").config();
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const News = require("../models/news");

const dataPath = path.join(__dirname, "data", "news.json");

const seedNews = async () => {
  try {
    await connectDB();

    const raw = fs.readFileSync(dataPath, "utf8");
    const parsed = JSON.parse(raw);
    const news = (Array.isArray(parsed) ? parsed : parsed.news || []).map((item) => {
      const {
        views,
        createdAt,
        updatedAt,
        day,
        month,
        year,
        dateLabel,
        ...rest
      } = item || {};
      return rest;
    });

    if (!news.length) {
      throw new Error("news.json bo'sh.");
    }

    await News.deleteMany();
    await News.insertMany(news);
    // Eski documentsdagi views maydonini tozalash (agar qolgan bo'lsa)
    await News.collection.updateMany({}, { $unset: { views: 1, day: 1, month: 1, year: 1 } });
    console.log(`Yangiliklar seed qilindi: ${news.length} ta.`);
  } catch (error) {
    console.error("News seed xatoligi:", error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedNews();
