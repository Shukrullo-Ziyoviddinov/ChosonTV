export const FILTER_GENRE_OPTIONS = [
  "Romantika",
  "Multfilim",
  "Anime",
  "Drama",
  "Komediya",
  "Jangari",
  "Boevik",
  "Qo'rqinchli",
  "Sarguzasht",
  "Fantastika",
];

export const TYPE_CATEGORY_OPTIONS = [
  "action",
  "drama",
  "thriller",
  "comedy",
  "hindi",
  "bollywood",
  "Romantika",
  "Jangare",
  "Komediya",
  "Sarguzasht",
  "Qo'rqinchli",
  "korea",
  "usa xitoy",
];

/** DB / catalog `categoryName` qiymatlari (moviesCatalogTransform bilan mos) */
export const CATEGORY_NAME_TO_SECTION = {
  russianMovie: "russianMovies",
  retroMovie: "retroMovies",
  romanceMovie: "romanceMovies",
  Komediya: "turkishSeries",
  turkishMovie: "turkishSeries", // eski qiymat (fallback)
  Detektiv: "worldMovies",
  worldMovie: "worldMovies", // eski qiymat (fallback)
  uzbekMovie: "uzbekMovies",
  tvSeries: "tvSeries",
  horrorMovie: "horrorMovies",
  Dorama: "koreaDrama",
  koreaDrama: "koreaDrama", // eski qiymat (fallback)
  kinolar: "kinolar",
  anime: "anime",
  adventureMovie: "adventureMovies",
  anons: "anonslar",
  actionMovie: "actionMovies",
  animation: "animations",
  animationMovie: "animations",
  multFilm: "animations",
};

export const CATEGORY_NAME_OPTIONS = Object.keys(CATEGORY_NAME_TO_SECTION).filter(
  (name, index, arr) => {
    // animations uchun asosiy: animation (dublikatlarni olib tashlash)
    if (name === "animationMovie" || name === "multFilm") return false;
    // Yangi nomlar asosiy; eski kalitlar faqat fallback
    if (name === "koreaDrama" || name === "worldMovie" || name === "turkishMovie") return false;
    return arr.indexOf(name) === index;
  }
);

export const CATEGORY_OPTIONS = [
  "russianMovies",
  "retroMovies",
  "romanceMovies",
  "turkishSeries",
  "worldMovies",
  "uzbekMovies",
  "tvSeries",
  "horrorMovies",
  "koreaDrama",
  "kinolar",
  "anime",
  "adventureMovies",
  "anonslar",
  "actionMovies",
  "animations",
];

/** Section → asosiy categoryName */
export const SECTION_TO_CATEGORY_NAME = Object.entries(CATEGORY_NAME_TO_SECTION).reduce(
  (acc, [categoryName, section]) => {
    if (!acc[section]) acc[section] = categoryName;
    return acc;
  },
  {}
);

export const isAnonsCategory = (categoryName, category) =>
  categoryName === "anons" || category === "anonslar";
