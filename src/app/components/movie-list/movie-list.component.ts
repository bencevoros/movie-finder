import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Movie } from '../../models/movie';
import { SearchType } from '../../enums/search-type';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent {
  SearchType = SearchType;

  @Input()
  movies: Readonly<Movie[]> = [];

  @Input()
  searchType!: SearchType;
  
  @Output()
  openMovieDetails: EventEmitter<{ movieId: number }> = new EventEmitter();

  openDetails(movieId: number) {
    this.openMovieDetails.emit({ movieId });
  }
}
