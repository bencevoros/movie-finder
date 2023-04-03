import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SEARCH_MOVIES } from '../graphql.queries';
import { Movie } from '../models/movie';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  constructor(private apollo: Apollo) {}

  searchMovies(keyword: string): Observable<Movie[]> {
    return this.apollo.query({
      query: SEARCH_MOVIES,
      variables: { query: keyword },
    }).pipe(
      take(1),
      map(({ data, error }) => data.searchMovies)
    );
  }
}
