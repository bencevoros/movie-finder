import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subject, throwError } from 'rxjs';
import { MoviesService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  keyword = new FormControl('fight club', Validators.required);

  moviesSubject: Subject<Movie[]> = new Subject();
  movies$: Observable<Readonly<Movie[]>> = this.moviesSubject.asObservable();
  moviesLoadingSubject: Subject<boolean> = new Subject();
  moviesLoading$: Observable<boolean> = this.moviesLoadingSubject.asObservable();
  moviesErrorSubject: Subject<string> = new Subject();
  moviesError$: Observable<string> = this.moviesErrorSubject.asObservable();

  constructor(
    private moviesService: MoviesService,
    private _snackBar: MatSnackBar,
  ) { }

  onHomeSubmit(event: Event) {
    event.preventDefault();
    this.moviesErrorSubject.next('');
    this._snackBar.dismiss();
    this.moviesLoadingSubject.next(true);

    this.moviesService.searchMovies(this.keyword.value || '')
      .subscribe({
        next: data => {
          this.moviesSubject.next(data);
          this.moviesLoadingSubject.next(false);
        },
        error: error => {
          console.error(error);
          this._snackBar.open('Failed to load movies', 'Close', { panelClass: 'error-snackbar'});
          this.moviesErrorSubject.next('Failed to load movies');
          this.moviesLoadingSubject.next(false);
        },
      });
  }

  resetKeyword() {
    this.keyword.reset();
  }
}
