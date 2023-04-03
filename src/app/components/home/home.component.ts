import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { MoviesService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component';

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

  constructor(
    private moviesService: MoviesService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  onHomeSubmit(event: Event) {
    event.preventDefault();
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
          this.moviesLoadingSubject.next(false);
        },
      });
  }

  openDetailsPopup(data: { movieId: number }) {
    this.dialog.open(MovieDetailDialogComponent, {
      data,
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
    });
  }

  resetKeyword() {
    this.keyword.reset();
  }
}
