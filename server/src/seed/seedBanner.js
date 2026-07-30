require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Banner = require("../models/banner");

const bannerImages = {
  uz: [
    {
      id: 111,
      movieId: 6005,
      image: "/img/movie3.jpg",
      titleImg: "/img/banner-title-the-eye.svg",
      description: "O'lim yakun bo'lmasa-chi? Sirli voqealar qarshisida qolgan ayol haqiqatni topishga urinadi.",
    },
    {
      id: 102,
      movieId: 5004,
      image: "/img/movie6.jpg",
      titleImg: "/img/banner-title-scream-7.svg",
      description: "Yangi qotilliklar boshlangach, eski sirlar yana yuzaga chiqadi va hech kim xavfsiz qolmaydi.",
    },
    {
      id: 103,
      movieId: 4008,
      image: "/img/movie12.jpg",
      titleImg: "/img/banner-title-hamnet.svg",
      description: "Sevgi, yo'qotish va ijod qudrati haqidagi ta'sirli tarixiy drama.",
    },
    {
      id: 104,
      movieId: 4007,
      image: "/img/movie15.jpg",
      titleImg: "/img/banner-title-bone-temple.svg",
      description: "Halokatdan yillar o'tib, omon qolganlar yangi va dahshatli xavfga duch keladi.",
    },
  ],
  ru: [
    {
      id: 101,
      movieId: 6005,
      image: "/img/movie3.jpg",
      titleImg: "/img/banner-title-the-eye.svg",
      description: "Что, если смерть — не конец? Столкнувшись с загадочными событиями, женщина пытается узнать правду.",
    },
    {
      id: 102,
      movieId: 5004,
      image: "/img/movie6.jpg",
      titleImg: "/img/banner-title-scream-7.svg",
      description: "Когда начинаются новые убийства, старые тайны вновь выходят наружу, и никто не остаётся в безопасности.",
    },
    {
      id: 103,
      movieId: 5008,
      image: "/img/movie12.jpg",
      titleImg: "/img/banner-title-hamnet.svg",
      description: "Трогательная историческая драма о любви, утрате и силе творчества.",
    },
    {
      id: 104,
      movieId: 4007,
      image: "/img/movie15.jpg",
      titleImg: "/img/banner-title-bone-temple.svg",
      description: "Спустя годы после катастрофы выжившие сталкиваются с новой ужасающей угрозой.",
    },
  ],
};

const bannerSeedData = Object.entries(bannerImages).flatMap(([lang, banners]) =>
  banners.map((item, index) => ({
    bannerId: item.id,
    movieId: item.movieId,
    image: item.image,
    titleImg: item.titleImg,
    description: item.description,
    lang,
    isActive: true,
    sortOrder: index + 1,
  }))
);

const seedBanners = async () => {
  try {
    await connectDB();
    await Banner.deleteMany();
    await Banner.insertMany(bannerSeedData);
    console.log("Bannerlar seed qilindi.");
  } catch (error) {
    console.error("Banner seed xatoligi:", error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedBanners();
