import { genresStr, moviesGenresStr, moviesStr } from "./const";
import { parseDbStr } from "./parser";

export type TMoviesSortFields = "id" | "movie" | "year" | "imdb_rating";
export type TMoviesSortParams = {
  field: TMoviesSortFields;
  order: TOrdering;
};
type TMovie = {
  id: number;
  movie: string;
  year: number;
  imdb_rating: number;
};
type TOrdering = "ASC" | "DESC";
type TGenre = {
  id: number;
  genre: string;
};
type TMovieGenreRelation = {
  movie_id: number;
  genre_id: number;
};

const sortBySingleParam = <T>(
  list: T[],
  param: string,
  order: TOrdering = "ASC"
) => {
  list.sort((a, b) => {
    if (param === "id" || param === "year" || param === "imdb_rating") {
      return order === "ASC" ? b[param] - a[param] : a[param] - b[param];
    }
    if (a[param] === b[param]) {
      return 0;
    }
    const movieSortResult =
      order === "ASC" ? a[param] > b[param] : a[param] < b[param];
    return movieSortResult ? 1 : -1;
  });
  return list;
};

export const sortGenres = (
  param: "id" | "genre" = "id",
  order: TOrdering
): TGenre[] => {
  const genres = parseDbStr<TGenre>(genresStr);
  return sortBySingleParam<TGenre>(genres, param, order);
};
export const sortMovies = (params: TMoviesSortParams[]): TMovie[] => {
  const movies = parseDbStr<TMovie>(moviesStr);
  params.forEach((param) =>
    sortBySingleParam(movies, param.field, param.order)
  );
  return movies;
};
export const filterMoviesByRating = (rating: number, order: TOrdering) => {
  const movies = parseDbStr<TMovie>(moviesStr);
  return movies.filter((m) =>
    order === "ASC" ? m.imdb_rating >= rating : m.imdb_rating <= rating
  );
};
export const filterMoviesByName = (name: string | RegExp) => {
  const movies = parseDbStr<TMovie>(moviesStr);
  let pattern: RegExp;
  if (typeof name === "string") {
    pattern = new RegExp(name, "ig");
  } else {
    pattern = name;
  }
  return movies.filter((m) => m.movie.match(pattern));
};
export const filmById = (id: number): TMovie[] => {
  const movies = parseDbStr<TMovie>(moviesStr);
  return movies.filter((m) => m.id === id);
};
export const genreById = (id: number): TMovie[] => {
  const genres = parseDbStr<TMovie>(genresStr);
  return genres.filter((g) => g.id === id);
};
export const filmsByGenreId = (genre_id: number): TMovie[] => {
  const movies = parseDbStr<TMovie>(moviesStr);
  const relation = parseDbStr<TMovieGenreRelation>(moviesGenresStr);
  const targetRelation = relation.filter((r) => r.genre_id === genre_id);
  const targetMoviesIds = targetRelation.map((r) => r.movie_id);
  const result = movies.filter((m) => targetMoviesIds.includes(m.id));
  return result;
};
export const genresByFilmId = (movie_id: number): TGenre[] => {
  const genres = parseDbStr<TGenre>(genresStr);
  const relation = parseDbStr<TMovieGenreRelation>(moviesGenresStr);
  const targetRelation = relation.filter((r) => r.movie_id === movie_id);
  const targetGenreIds = targetRelation.map((r) => r.genre_id);
  const result = genres.filter((g) => targetGenreIds.includes(g.id));
  return result;
};
const filmsByGenre = (genre: string): TMovie[] => {
  const genres = parseDbStr<TGenre>(genresStr);
  const genreObj = genres.find(
    (g) => g.genre.toLowerCase() === genre.toLowerCase()
  );
  const genre_id = genreObj ? genreObj.id : 0;
  const result = filmsByGenreId(genre_id);
  return result;
};
export const sortedFilmsByGenre = (genre: string, order: TOrdering) =>
  sortBySingleParam(filmsByGenre(genre), "imdb_rating", order);
