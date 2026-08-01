require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Actor = require("../models/actors");

const actors = [
  {
    id: 1,
    name: { uz: "Leonardo DiCaprio", ru: "Леонардо ДиКаприо" },
    image: "/img/leanordo.jpg",
    info: {
      uz: "Amerikalik aktyor va produser. Inception, Titanic, The Revenant kabi filmlarda rol o'ynagan. Oscar mukofoti sohibi, atrof-muhit himoyasi bilan ham faol shug'ullanadi va ko'plab yirik kinoloyihalarda ishtirok etgan.",
      ru: "Американский актёр и продюсер. Снимался в фильмах Начало, Титаник, Выживший. Обладатель премии Оскар, активно занимается защитой окружающей среды и участвует в крупных кинопроектах.",
    },
  },
  {
    id: 2,
    name: { uz: "Tobey Maguire", ru: "Тоби Магуайр" },
    image: "/img/toby.jpg",
    info: {
      uz: "Amerikalik aktyor. Spider-Man trilogiyasida Peter Parker rolini ijro etgan. Dramatik rollari bilan ham tanilgan, Seabiscuit va Brothers kabi filmlarda kuchli ijro ko'rsatgan.",
      ru: "Американский актёр. Исполнил роль Питера Паркера в трилогии Человек-паук. Также известен драматическими ролями, ярко сыграл в фильмах Seabiscuit и Brothers.",
    },
  },
  {
    id: 3,
    name: { uz: "Katrina Kaif", ru: "Катрина Кайф" },
    image: "/img/katrinas.jpg",
    info: {
      uz: "Hindiston-Britaniya aktrisasi. Bollywood filmlarida suratga tushgan. Namastey London, Zindagi Na Milegi Dobara kabi mashhur filmlari bilan keng auditoriyaga tanilgan.",
      ru: "Индийско-британская актриса. Снималась в фильмах Болливуда. Широко известна по популярным картинам Namastey London и Zindagi Na Milegi Dobara.",
    },
  },
  {
    id: 4,
    name: { uz: "Leonardo DiCaprio", ru: "Леонардо ДиКаприо" },
    image: "/img/leanordo.jpg",
    info: {
      uz: "Amerikalik aktyor va produser. Inception, Titanic, The Revenant kabi filmlarda rol o'ynagan. Oscar mukofoti sohibi, atrof-muhit himoyasi bilan ham faol shug'ullanadi va ko'plab yirik kinoloyihalarda ishtirok etgan.",
      ru: "Американский актёр и продюсер. Снимался в фильмах Начало, Титаник, Выживший. Обладатель премии Оскар, активно занимается защитой окружающей среды и участвует в крупных кинопроектах.",
    },
  },
  {
    id: 5,
    name: { uz: "Tobey Maguire", ru: "Тоби Магуайр" },
    image: "/img/toby.jpg",
    info: {
      uz: "Amerikalik aktyor. Spider-Man trilogiyasida Peter Parker rolini ijro etgan. Dramatik rollari bilan ham tanilgan, Seabiscuit va Brothers kabi filmlarda kuchli ijro ko'rsatgan.",
      ru: "Американский актёр. Исполнил роль Питера Паркера в трилогии Человек-паук. Также известен драматическими ролями, ярко сыграл в фильмах Seabiscuit и Brothers.",
    },
  },
  {
    id: 6,
    name: { uz: "Katrina Kaif", ru: "Катрина Кайф" },
    image: "/img/katrinas.jpg",
    info: {
      uz: "Hindiston-Britaniya aktrisasi. Bollywood filmlarida suratga tushgan. Namastey London, Zindagi Na Milegi Dobara kabi mashhur filmlari bilan keng auditoriyaga tanilgan.",
      ru: "Индийско-британская актриса. Снималась в фильмах Болливуда. Широко известна по популярным картинам Namastey London и Zindagi Na Milegi Dobara.",
    },
  },
];

const actorSeedData = actors.map((actor) => ({
  actorId: actor.id,
  name: actor.name,
  image: actor.image,
  info: actor.info,
  isActive: true,
}));

const seedActors = async () => {
  try {
    await connectDB();
    await Actor.deleteMany();
    await Actor.insertMany(actorSeedData);
    console.log("Actorlar seed qilindi.");
  } catch (error) {
    console.error("Actors seed xatoligi:", error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedActors();
