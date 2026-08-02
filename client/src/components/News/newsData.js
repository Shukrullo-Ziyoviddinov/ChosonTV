/**
 * Bitta news collection — massivlar name bilan ajratiladi.
 * Server/schema keyin ulanadi; hozircha lokal data.
 */
export const newsCollection = {
  yangiliklar: [
    {
      id: 1,
      name: {
        uz: "Joker 2 treyleri chiqdi — Joaquin Phoenix va Lady Gaga birga",
        ru: "Вышел трейлер Джокера 2 — Хоакин Феникс и Леди Гага вместе",
      },
      description: {
        uz: "Warner Bros yangi treylerni e'lon qildi. Filmda Joaquin Phoenix yana Arthur Fleck rolini ijro etadi, Lady Gaga esa Harley Quinn sifatida chiqadi. Treylerda musiqiy sahnalar va qorong'u atmosfera ko'rsatilgan. Premera sanasi yaqinlashmoqda va muxlislar kutishmoqda.",
        ru: "Warner Bros представила новый трейлер. Хоакин Феникс снова играет Артура Флека, а Леди Гага появляется в роли Харли Квинн. В ролике показаны музыкальные сцены и мрачная атмосфера. Премьера близко, фанаты ждут фильм.",
      },
      img: "/img/movie-4.5-1.avif",
      day: 2,
      month: 8,
      year: 2026,
      badge: "ASOSIY",
    },
    {
      id: 2,
      name: {
        uz: "Deadpool & Wolverine yangi kadrlar e'lon qilindi",
        ru: "Опубликованы новые кадры Deadpool & Wolverine",
      },
      description: {
        uz: "Marvel Studios Deadpool 3 uchun yangi rasmiy kadrlar chiqardi. Ryan Reynolds va Hugh Jackman birga sahnalarda ko'rinadi. Film komediya va jangari janrlarini birlashtiradi. Kinoteatrlarga chiqish sanasi tasdiqlandi.",
        ru: "Marvel Studios выпустила новые официальные кадры Deadpool 3. Райан Рейнольдс и Хью Джекман появляются вместе. Фильм сочетает комедию и экшен. Дата выхода в кинотеатрах подтверждена.",
      },
      img: "/img/movie-4.5-2.jpeg",
      day: 28,
      month: 7,
      year: 2026,
      badge: "MARVEL",
    },
    {
      id: 3,
      name: {
        uz: "The Batman Part II suratga olish ishlari boshlandi",
        ru: "Начались съёмки The Batman Part II",
      },
      description: {
        uz: "DC Studios The Batman davomi uchun ishlab chiqarishni boshladi. Robert Pattinson Batman rolini davom ettiradi. Matt Reeves yana rejissyorlik qiladi. Film Gothamning yanada chuqurroq sirlari haqida hikoya qiladi.",
        ru: "DC Studios начала производство продолжения The Batman. Роберт Паттинсон снова сыграет Бэтмена. Мэтт Ривз снова режиссёр. Фильм расскажет о более глубоких тайнах Готэма.",
      },
      img: "/img/movie-4.5-3.jpg",
      day: 15,
      month: 7,
      year: 2026,
      badge: "DC",
    },
    {
      id: 4,
      name: {
        uz: "Yangi koreys seriali global reytingda birinchi o'rin oldi",
        ru: "Новый корейский сериал возглавил мировой рейтинг",
      },
      description: {
        uz: "Netflixda chiqqan yangi koreys dramasining birinchi haftasi rekord natija ko'rsatdi. Serial jinoyat va oilaviy drama janrlarini uyg'unlashtiradi. Tomoshabinlar ikkinchi faslni so'rashmoqda. Studiyadan rasmiy javob hali yo'q.",
        ru: "Новая корейская драма на Netflix показала рекорд в первую неделю. Сериал сочетает криминал и семейную драму. Зрители просят второй сезон. Официального ответа студии пока нет.",
      },
      img: "/img/movie-4.5-4.webp",
      day: 10,
      month: 6,
      year: 2026,
      badge: "SERIAL",
    },
  ],

  trenddagiYangiliklar: [
    {
      id: 101,
      name: {
        uz: "Deadpool & Wolverine rasmiy treyleri rekord o'rnatdi",
        ru: "Официальный трейлер Deadpool & Wolverine побил рекорд",
      },
      description: {
        uz: "Yangi treyler birinchi soatdayoq millionlab ko'rishlar to'pladi. Ryan Reynolds va Hugh Jackman juftligi muxlislarni hayratda qoldirdi. Video ichida eksklyuziv kadrlar ham bor.",
        ru: "Новый трейлер набрал миллионы просмотров за первый час. Дуэт Райана Рейнольдса и Хью Джекмана удивил фанатов. В ролике есть эксклюзивные кадры.",
      },
      img: "/img/movie-4.5-2.jpeg",
      video: "/video/The Amateur _ Official Trailer.mp4",
      day: 2,
      month: 8,
      year: 2026,
    },
    {
      id: 102,
      name: {
        uz: "Avatar 3 dan yangi kadrlar e'lon qilindi",
        ru: "Опубликованы новые кадры из Avatar 3",
      },
      description: {
        uz: "James Cameron yangi film uchun rasmiy kadrlar chiqardi. Pandora dunyosi yanada kengroq ko'rsatilgan. Treyler va video fragmentlar tez orada chiqadi.",
        ru: "Джеймс Кэмерон показал официальные кадры нового фильма. Мир Пандоры раскрыт ещё шире. Трейлер и видеофрагменты выйдут скоро.",
      },
      img: "/img/movie-4.5-5.jpg",
      video: "/video/Zivert - Life   Премьера клипа.mp4",
      day: 1,
      month: 8,
      year: 2026,
    },
    {
      id: 103,
      name: {
        uz: "Furiosa premerasidan keyin bahs davom etmoqda",
        ru: "После премьеры Furiosa споры продолжаются",
      },
      description: {
        uz: "Mad Max dunyosiga qaytish tomoshabinlarni ikkiga bo'ldi. Ba'zilar vizual effektlarni maqtadi, boshqalar hikoyani sekin deb topdi. Rasmiy video sharhlar chiqmoqda.",
        ru: "Возвращение во вселенную Mad Max разделило зрителей. Одни хвалят визуальные эффекты, другие считают сюжет медленным. Выходят официальные видеообзоры.",
      },
      img: "/img/movie-4.5-6.avif",
      video: "/video/The Amateur _ Official Trailer.mp4",
      day: 30,
      month: 7,
      year: 2026,
    },
    {
      id: 104,
      name: {
        uz: "Gladiator 2 daromadi kutganidan oshdi",
        ru: "Сборы Gladiator 2 превысили ожидания",
      },
      description: {
        uz: "Ridley Scott filmi ochilish damida kuchli natija ko'rsatdi. Paul Mescal ijrosi alohida e'tirof etilmoqda. Studiyadan yangi promo video chiqarildi.",
        ru: "Фильм Ридли Скотта показал сильный старт. Игру Пола Мескала особенно отмечают. Студия выпустила новое промо-видео.",
      },
      img: "/img/movie-4.5-3.jpg",
      video: "/video/Zivert - Life   Премьера клипа.mp4",
      day: 28,
      month: 7,
      year: 2026,
    },
  ],

  yangiliklarGrid: [
    {
      id: 201,
      name: {
        uz: "Avengers 5: Kang Dynasty suratga olish yakunlandi",
        ru: "Съёмки Avengers 5: Kang Dynasty завершены",
      },
      description: {
        uz: "Marvel Studios yangi Avengers filmining suratga olish ishlarini yakunladi. Jonathan Majors Kang rolida qaytadi. Premera sanasi hali e'lon qilinmagan.",
        ru: "Marvel Studios завершила съёмки нового Avengers. Джонатан Мейджорс снова сыграет Канга. Дата премьеры пока не объявлена.",
      },
      img: "/img/movie-4.5-5.jpg",
      views: 2800,
      day: 30,
      month: 7,
      year: 2026,
    },
    {
      id: 202,
      name: {
        uz: "The Batman 2: birinchi teaser chiqishi mumkin",
        ru: "The Batman 2: возможен первый тизер",
      },
      description: {
        uz: "DC Studios yaqin oylarda The Batman davomi uchun teaser chiqarishi mumkinligi haqida gapirilmoqda. Robert Pattinson yana Batman rolida.",
        ru: "Ходят слухи, что DC Studios скоро может выпустить тизер продолжения The Batman. Роберт Паттинсон снова в роли Бэтмена.",
      },
      img: "/img/movie-4.5-3.jpg",
      views: 5100,
      day: 28,
      month: 7,
      year: 2026,
    },
    {
      id: 203,
      name: {
        uz: "Stranger Things 5 yakuniy fasl sanasi e'lon qilindi",
        ru: "Объявлена дата финального сезона Stranger Things 5",
      },
      description: {
        uz: "Netflix Stranger Things oxirgi faslining chiqish sanasini tasdiqladi. Muxlislar uchun maxsus treyler ham chiqariladi.",
        ru: "Netflix подтвердила дату выхода последнего сезона Stranger Things. Для фанатов также выйдет специальный трейлер.",
      },
      img: "/img/movie-4.5-4.webp",
      views: 12400,
      day: 25,
      month: 7,
      year: 2026,
    },
    {
      id: 204,
      name: {
        uz: "Mission Impossible 8: Tom Cruise yana stunt qildi",
        ru: "Mission Impossible 8: Том Круз снова сделал трюк",
      },
      description: {
        uz: "Tom Cruise yangi filmdagi eng xavfli stuntni o'zi ijro etganini aytdi. Video kadrlar tez orada e'lon qilinadi.",
        ru: "Том Круз подтвердил, что сам выполнил самый опасный трюк в новом фильме. Видеокадры скоро опубликуют.",
      },
      img: "/img/movie-4.5-6.avif",
      views: 8700,
      day: 22,
      month: 7,
      year: 2026,
    },
    {
      id: 205,
      name: {
        uz: "Demon Slayer: Infinity Castle treyleri chiqdi",
        ru: "Вышел трейлер Demon Slayer: Infinity Castle",
      },
      description: {
        uz: "Anime filmining rasmiy treyleri e'lon qilindi. Jangari sahnalar va yangi qahramonlar ko'rsatilgan.",
        ru: "Опубликован официальный трейлер аниме-фильма. Показаны боевые сцены и новые персонажи.",
      },
      img: "/img/movie-4.5-7.jpg",
      views: 15200,
      day: 20,
      month: 7,
      year: 2026,
    },
    {
      id: 206,
      name: {
        uz: "Christopher Nolan yangi filmi uchun aktyorlar tanlandi",
        ru: "Выбран актёрский состав нового фильма Кристофера Нолана",
      },
      description: {
        uz: "Nolan navbatdagi loyihasi uchun yulduzli cast e'lon qildi. Suratga olish 2026 oxirida boshlanadi.",
        ru: "Нолан объявил звёздный каст следующего проекта. Съёмки начнутся в конце 2026 года.",
      },
      img: "/img/movie-4.5-8.jpg",
      views: 9300,
      day: 18,
      month: 7,
      year: 2026,
    },
  ],
};

export const getNewsSection = (sectionName) => {
  const rows = newsCollection?.[sectionName];
  return Array.isArray(rows) ? rows : [];
};
