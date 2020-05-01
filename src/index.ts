import { AppService } from "./app-service";
import { menuList } from "./const";
import { doFilter, doSort, getById, TSortParams } from "./fn";
import { serializeToDbStr } from "./parser";
import { prompt } from "./prompt";

const menuArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const start = async () => {
  const service = new AppService();
  while (true) {
    console.log(menuList);
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
            serializeToDbStr(
              doSort(service.movies, [{ field: "imdb_rating", order }])
            )
          );
        }
        break;
      case 2:
        {
          const orderAns = await prompt(
            "Введите ASC или DESC. Неправильный ввод будет воспринят как ASC: "
          );
          const order = orderAns === "DESC" ? "DESC" : "ASC";
          console.log(
            serializeToDbStr(
              doSort(service.genres, [{ field: "genre", order }])
            )
          );
        }
        break;
      case 3:
        {
          const fields = ["id", "movie", "year", "imdb_rating"];
          const params: TSortParams[] = [];
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
            params.push({ field, order });
          }
          console.log(serializeToDbStr(doSort(service.movies, params)));
        }
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

          const order = strOrd === "1" ? "DESC" : "ASC";
          console.log(
            serializeToDbStr(
              doFilter(service.movies, [
                { field: "imdb_rating", value: rating, order },
              ])
            )
          );
        }
        break;
      case 5:
        {
          let pattern: string | RegExp = await prompt(
            "Введите строку для поиска. При пустой введенной строке используется регулярное выражение /(lord|war)/i: "
          );
          if (pattern.trim().length === 0) {
            pattern = /(lord|war)/i;
          }
          console.log(
            serializeToDbStr(
              doFilter(service.movies, [{ field: "movie", value: pattern }])
            )
          );
        }
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
          console.log(serializeToDbStr([getById(service.movies, id)]));
        }
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
          console.log(serializeToDbStr([getById(service.genres, id)]));
        }
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
          console.log(serializeToDbStr(service.filmsByGenreId(id)));
        }
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
          console.log(serializeToDbStr(service.genresByFilmId(id)));
        }
        break;
      case 10:
        {
          let genre = await prompt(
            "Введите название жанра для поиска. Пустая строка будет принята как Action: "
          );
          if (genre.trim().length === 0) {
            genre = "Action";
          }
          console.log(
            serializeToDbStr(service.sortedFilmsByGenre(genre, "ASC"))
          );
        }
        break;
      case 0:
        process.exit(0);
    }
  }
};
start();
