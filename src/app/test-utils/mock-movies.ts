import { Movie } from '../models/movie';

export const getMockMovie = (id: number = 1): Movie => ({
  id,
  name: 'Mock movie name',
  overview: 'overview',
  releaseDate: new Date(),
  budget: 10000,
  revenue: 'revenue',
  adult: false,
  popularity: 100,
  score: 4.0,
  votes: 100,
  socialMedia: {
    imdb: 'IMDB_URL',
  },
  similar: []
});

export const getMockMovieWithSimilar = (): Movie => ({
  ...getMockMovie(1),
  similar: [
    getMockMovie(2),
    getMockMovie(3),
  ]
});

export const getMockMovies = (): Movie[] => [getMockMovie()];
