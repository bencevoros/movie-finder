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
      genres {
        name
      }
      socialMedia {
        imdb
      }
    }
  }
`;

export const GET_MOVIE = gql<{ movie: Movie }, { id: number }>`
  query getMovie($id: ID!) {
    movie(id: $id) {
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
      genres {
        name
      }
      socialMedia {
        imdb
      }
    }
  }
`;

export const GET_SIMILAR_MOVIES = gql<{ movie: { similar: Movie[] } }, { id: number; page: number; limit: number }>`
  query getMovie($id: ID!) {
    movie(id: $id) {
      similar(language: English) {
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
        genres {
          name
        }
        socialMedia {
          imdb
        }
      }
    }
  }
`;
