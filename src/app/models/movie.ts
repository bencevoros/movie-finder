export interface Movie {
  id: number;
  name: string;
  tagline?: string;
  overview: string;
  // country: [Country!]!
  // languages: [Language!]!
  // status: ReleaseStatus!
  // genres: [Genre!]!
  // keywords: [Keyword!]!
  releaseDate: Date;
  runtime?: number
  budget: number;
  revenue: string;
  adult: boolean;
  // cast(limit?: number): [Credit!]!
  // crew(limit?: number): [Credit!]!
  // productionCompanies: [Company!]!
  // homepage?: URL;
  // socialMedia: SocialMedia
  // poster: Poster
  // backdrop: Backdrop
  // images: [MediaImage!]!
  // videos(language: Translations, filter: VideoFilter, first?: number): [Video!]!
  popularity: number;
  score: number;
  votes: number;
  // reviews(
  //   language: Translations
  //   limit?: number
  //   page: PageRange = false
  // ): [Review!]!
  // collection(language: Translations): Collection
  // recommended(
  //   language: Translations
  //   page: PageRange = false
  //   limit?: number
  // ): [Movie!]!
  // similar(
  //   language: Translations
  //   page: PageRange = false
  //   limit?: number
  // ): [Movie!]!
}