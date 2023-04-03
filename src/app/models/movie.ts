interface SocialMedia {
  imdb: string | null;
}

export interface Movie {
  id: number;
  name: string;
  tagline?: string;
  overview: string;
  releaseDate: Date;
  runtime?: number
  budget: number;
  revenue: string;
  adult: boolean;
  socialMedia: SocialMedia;
  popularity: number;
  score: number;
  votes: number;
  similar?: Movie[];
}
