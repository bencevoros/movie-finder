import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent {
  @Input()
  movies: Readonly<Movie[]> = [];
  
  @Output()
  openMovieDetails: EventEmitter<{ movieId: number }> = new EventEmitter();

  openDetails(movieId: number) {
    this.openMovieDetails.emit({ movieId });
  }
}
