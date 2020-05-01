import { genresStr, moviesGenresStr, moviesStr } from "./const";
import {
  getByFullRelation,
  getByRelationTable,
  sortBySingleParam,
  TIdType,
  TOrdering,
} from "./fn";
import { parseDbStr } from "./parser";

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
export class AppService {
  private _movies: TMovie[];
  private _genres: TGenre[];
  private _relations: TMovieGenreRelation[];
  get movies(): TMovie[] {
    if (!this._movies) {
      this._movies = parseDbStr<TMovie>(moviesStr);
    }
    return this._movies;
  }
  get genres(): TGenre[] {
    if (!this._genres) {
      this._genres = parseDbStr<TGenre>(genresStr);
    }
    return this._genres;
  }
  get relations(): TMovieGenreRelation[] {
    if (!this._relations) {
      this._relations = parseDbStr<TMovieGenreRelation>(moviesGenresStr);
    }
    return this._relations;
  }
  filmsByGenreId = (genre_id: number): TMovie[] => {
    return getByRelationTable(
      this.movies,
      "id",
      this.relations,
      "movie_id",
      genre_id
    );
  };
  genresByFilmId = (movie_id: number): TGenre[] => {
    return getByRelationTable(
      this.genres,
      "id",
      this.relations,
      "genre_id",
      movie_id
    );
  };
  filmsByGenre = (genre: string): TMovie[] => {
    return getByFullRelation(
      this.movies,
      "id",
      this.relations,
      "movie_id",
      this.genres,
      "id",
      "genre",
      genre
    );
  };
  sortedFilmsByGenre = (genre: string, order: TOrdering) =>
    sortBySingleParam(this.filmsByGenre(genre), "imdb_rating", order);
}
