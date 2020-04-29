import { genresStr, moviesGenresStr, moviesStr } from "./const";
import { parseDbStr } from "./parser";

type TOrdering = "ASC" | "DESC";
export type TSortParams = {
  field: string;
  order?: TOrdering;
};
export type TFilterParams = TSortParams & {
  value: string | number | RegExp;
};
type TIdType = {
  id: number;
};
type TMovie = TIdType & {
  movie: string;
  year: number;
  imdb_rating: number;
};
type TGenre = TIdType & {
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
    if (a[param] === b[param]) {
      return 0;
    }
    //сортировка числовых и булевых полей
    const paramType = typeof a[param];
    if (paramType !== "string") {
      return order === "ASC" ? b[param] - a[param] : a[param] - b[param];
    }
    //сортировка по тексту
    const movieSortResult =
      order === "ASC" ? a[param] > b[param] : a[param] < b[param];
    return movieSortResult ? 1 : -1;
  });
  return list;
};

export const doSort = <T>(str: string, params: TSortParams[]) => {
  const list = parseDbStr<T>(str);
  params.forEach((param) => sortBySingleParam(list, param.field, param.order));
  return list;
};
const doSingleFilter = <T>(list: T[], param: TFilterParams) => {
  if (typeof list[0][param.field] === "number") {
    return list.filter((m) =>
      param.order === "ASC"
        ? m[param.field] >= param.value
        : m[param.field] <= param.value
    );
  }
  let pattern: RegExp;
  if (typeof param.value === "string") {
    //патерн для глобального региcтронечувствительного поиска
    pattern = new RegExp(param.value, "ig");
  } else {
    pattern = param.value as RegExp;
  }
  return list.filter((m) => m[param.field].match(pattern));
};
export const doFilter = <T>(str: string, params: TFilterParams[]) => {
  const list = parseDbStr<T>(str);
  let result = list;
  params.forEach((param) => {
    result = doSingleFilter(result, param);
  });
  return result;
};

export const getById = <T extends TIdType>(str: string, id: number) => {
  const list = parseDbStr(str) as T[];
  return list.filter((m) => m.id === id);
};
const getByRelationTable = <T>(
  targetStr: string,
  fieldInMainTable: string,
  relationStr: string,
  fieldInRelationTable: string,
  relatedValue: number | string
) => {
  const list = parseDbStr<T>(targetStr);
  const relations = parseDbStr(relationStr);
  const relationField = Object.keys(relations[0]).find(
    (f) => f !== fieldInRelationTable
  );
  const targetRelations = relations.filter(
    (r) => r[relationField] === relatedValue
  );
  const targetValues = targetRelations.map((r) => r[fieldInRelationTable]);
  const result = list.filter((el) =>
    targetValues.includes(el[fieldInMainTable])
  );
  return result;
};
export const filmsByGenreId = (genre_id: number): TMovie[] => {
  return getByRelationTable(
    moviesStr,
    "id",
    moviesGenresStr,
    "movie_id",
    genre_id
  );
};
export const genresByFilmId = (movie_id: number): TGenre[] => {
  return getByRelationTable(
    genresStr,
    "id",
    moviesGenresStr,
    "genre_id",
    movie_id
  );
};
export const getByFullRelation = <T>(
  mainStr: string,
  relationFieldInMainTable: string,
  relationStr: string,
  mainFieldInRelationTable: string,
  secondStr: string,
  relationFiendInSecondTable: string,
  targetField: string,
  targetValue: string | number
) => {
  const secondList = parseDbStr(secondStr);
  const relatedEl = secondList.find(
    (el) =>
      `${el[targetField]}`.toLowerCase() === `${targetValue}`.toLowerCase()
  );
  const relatedValue = relatedEl ? relatedEl[relationFiendInSecondTable] : null;
  return getByRelationTable<T>(
    mainStr,
    relationFieldInMainTable,
    relationStr,
    mainFieldInRelationTable,
    relatedValue
  );
};
const filmsByGenre = (genre: string): TMovie[] => {
  return getByFullRelation(
    moviesStr,
    "id",
    moviesGenresStr,
    "movie_id",
    genresStr,
    "id",
    "genre",
    genre
  );
};
export const sortedFilmsByGenre = (genre: string, order: TOrdering) =>
  sortBySingleParam(filmsByGenre(genre), "imdb_rating", order);
