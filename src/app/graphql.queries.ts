import { gql } from 'apollo-angular'
import { Movie } from './models/movie';

export const SEARCH_MOVIES = gql<{ searchMovies: Movie[] }, { query: string }>`
  query SearchMovies($query: String!) {
    searchMovies(query: $query) {
      id
      name
      tagline
      overview
      releaseDate
      runtime
      budget
      revenue
      adult
      popularity
      score
      votes
    }
  }
`;
