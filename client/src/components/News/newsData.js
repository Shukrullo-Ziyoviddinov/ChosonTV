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
};

export const getNewsSection = (sectionName) => {
  const rows = newsCollection?.[sectionName];
  return Array.isArray(rows) ? rows : [];
};
