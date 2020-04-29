import {
  filmById,
  filmsByGenreId,
  filterMoviesByName,
  filterMoviesByRating,
  genreById,
  genresByFilmId,
  sortedFilmsByGenre,
  sortGenres,
  sortMovies,
  TMoviesSortFields,
  TMoviesSortParams,
} from "./fn";
import { serializeToDbStr } from "./parser";
import { prompt } from "./prompt";

const menuArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const start = async () => {
  console.log(`
1. отсортировать данные таблицы фильмов по рейтингу, ASC or DESC;
2. отсортировать данные таблицы жанров по именам, ASC or DESC;
3. отсортировать данные таблицы фильмов одновременно по 2м полям, направление сортировки по каждому полю независимо от другого поля;
4. отфильтровать данные таблицы фильмов по рейтингу (например выбрать все выше 5.0);
5. отфильтровать данные таблицы фильмов по регулярному выражению (например имя удовлетворяет паттерну /(lord|war)/i);
6. получить запись о фильме по его номеру (поле id);
7. получить запись о жанре по его номеру (поле id);
8. получить список фильмов по номеру жанра;
9. получить список жанров по номеру фильма;
10. вывести список фильмов жанра 'Action', упорядоченных по убыванию рейтинга
0. закрыть
`);
  let ans = await prompt("Укажите один из перечисленных пунктов: ");
  while (!menuArr.includes(ans)) {
    ans = await prompt("Введенный параметр неверный. Попробуйте снова: ");
  }
  const num = Number(ans);
  switch (num) {
    case 1:
      {
        const orderAns = await prompt(
          "Введите ASC или DESC. Неправильный ввод будет воспринят как ASC: "
        );
        const order = orderAns === "DESC" ? "DESC" : "ASC";
        console.log(
          serializeToDbStr(sortMovies([{ field: "imdb_rating", order }]))
        );
      }
      start();
      break;
    case 2:
      {
        const orderAns = await prompt(
          "Введите ASC или DESC. Неправильный ввод будет воспринят как ASC: "
        );
        const order = orderAns === "DESC" ? "DESC" : "ASC";
        console.log(serializeToDbStr(sortGenres("genre", order)));
      }
      start();
      break;
    case 3:
      {
        const fields = ["id", "movie", "year", "imdb_rating"];
        const params: TMoviesSortParams[] = [];
        for (let i = 0; i < 2; i++) {
          let field = await prompt(
            `Укажите один из перечисленных пунктов: ${fields.join(", ")}: `
          );
          while (!fields.includes(field)) {
            field = await prompt(
              `Введенный параметр неверный. Попробуйте снова: ${fields.join(
                ", "
              )}`
            );
          }
          const orderAns = await prompt(
            "Введите ASC или DESC. Неправильный ввод будет воспринят как ASC: "
          );
          const order = orderAns === "DESC" ? "DESC" : "ASC";
          params.push({ field: field as TMoviesSortFields, order });
        }
        console.log(serializeToDbStr(sortMovies(params)));
      }
      start();
      break;
    case 4:
      {
        let strRating = await prompt("Введите рейтинг: ");
        while (isNaN((strRating as unknown) as number)) {
          strRating = await prompt(
            "Введенный параметр неверный. Попробуйте снова: "
          );
        }
        const rating = Number(strRating);
        const strOrd = await prompt(
          "Введите один из перечисленных пунктов: 1 - ниже указаного рейтинга, всё остальное - выше: "
        );

        const ord = strOrd === "1" ? "DESC" : "ASC";
        console.log(serializeToDbStr(filterMoviesByRating(rating, ord)));
      }
      start();
      break;
    case 5:
      {
        let pattern: string | RegExp = await prompt(
          "Введите строку для поиска. При пустой введенной строке используется регулярное выражение /(lord|war)/i: "
        );
        if (pattern.trim().length === 0) {
          pattern = /(lord|war)/i;
        }
        console.log(serializeToDbStr(filterMoviesByName(pattern)));
      }
      start();
      break;
    case 6:
      {
        let strId = await prompt("Введите id фильма: ");
        while (isNaN((strId as unknown) as number)) {
          strId = await prompt(
            "Введенный параметр неверный. Попробуйте снова: "
          );
        }
        const id = Number(strId);
        console.log(serializeToDbStr(filmById(id)));
      }
      start();
      break;
    case 7:
      {
        let strId = await prompt("Введите id жанра: ");
        while (isNaN((strId as unknown) as number)) {
          strId = await prompt(
            "Введенный параметр неверный. Попробуйте снова: "
          );
        }
        const id = Number(strId);
        console.log(serializeToDbStr(genreById(id)));
      }
      start();
      break;
    case 8:
      {
        let strId = await prompt("Введите id жанра: ");
        while (isNaN((strId as unknown) as number)) {
          strId = await prompt(
            "Введенный параметр неверный. Попробуйте снова: "
          );
        }
        const id = Number(strId);
        console.log(serializeToDbStr(filmsByGenreId(id)));
      }
      start();
      break;
    case 9:
      {
        let strId = await prompt("Введите id фильма: ");
        while (isNaN((strId as unknown) as number)) {
          strId = await prompt(
            "Введенный параметр неверный. Попробуйте снова: "
          );
        }
        const id = Number(strId);
        console.log(serializeToDbStr(genresByFilmId(id)));
      }
      start();
      break;
    case 10:
      {
        let genre = await prompt(
          "Введите название жанра для поиска. Пустая строка будет принята как Action: "
        );
        if (genre.trim().length === 0) {
          genre = "Action";
        }
        console.log(serializeToDbStr(sortedFilmsByGenre(genre, "ASC")));
      }
      start();
      break;
    case 0:
      process.exit(0);
  }
};
start();
