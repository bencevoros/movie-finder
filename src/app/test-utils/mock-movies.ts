import { Movie } from '../models/movie';

export const getMockMovies = (): Movie[] => [{
  id: 1,
  name: 'Mock movie name',
  overview: 'overview',
  releaseDate: new Date(),
  budget: 10000,
  revenue: 'revenue',
  adult: false,
  popularity: 100,
  score: 4.0,
  votes: 100,
}];