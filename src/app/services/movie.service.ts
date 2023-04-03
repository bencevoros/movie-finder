import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GET_MOVIE, SEARCH_MOVIES } from '../graphql.queries';
import { Movie } from '../models/movie';
import { WikiResponse } from '../models/wiki-response';
import { WikiDetails } from '../models/wiki-details';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  constructor(
    private apollo: Apollo,
    private http: HttpClient,
  ) {}

  getMovieById(movieId: number): Observable<Movie> {
    return this.apollo.query({
      query: GET_MOVIE,
      variables: { id: movieId },
    }).pipe(
      take(1),
      map(({ data, error }) => data.movie),
    )
  }

  getMovieDescription(movieName: string, releaseDate: Date): Observable<WikiDetails | undefined> {
    const searchTerm = `${movieName} ${new Date(releaseDate).getFullYear()} film`;

    const params = new HttpParams()
      .append('action', 'query')
      .append('list', 'search')
      .append('origin', '*')
      .append('format', 'json')
      .append('prop', 'categories')
      .append('srlimit', '1')
      .append('srsearch', searchTerm)
      .append('srwhat', 'text')
      .append('srprop', 'snippet')
      .append('clcategories', 'Category:Film')
      .append('formatversion', '2');

    return this.http.get<WikiResponse>('https://en.wikipedia.org/w/api.php', { params })
      .pipe(
        map(response => {
          if (response.query.search.length > 0) {
            return this.getSecureWikiDetails(response.query.search[0]);
          }

          return undefined;
        })
      );
  }

  searchMovies(keyword: string): Observable<Movie[]> {
    return this.apollo.query<{ searchMovies: Movie[] }>({
      query: SEARCH_MOVIES,
      variables: { query: keyword },
    }).pipe(
      take(1),
      map(({ data, error }) => data.searchMovies)
    );
  }

  private getSecureWikiDetails(wikiDetails: WikiDetails): WikiDetails {
    return {
      ...wikiDetails,
      snippet: wikiDetails.snippet.replace(/<.*?>/g, '').replace(/\&.*?\;/g, ''),
    }
  }
}
