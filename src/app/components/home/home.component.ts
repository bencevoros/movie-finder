import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MoviesService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component';
import { SearchType } from '../../enums/search-type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {
  private selectMovieForSimilarSubscription: Subscription | undefined;

  searchType: SearchType = SearchType.REGULAR;
  relatedKeyword: string | undefined;

  moviesSubject: Subject<Movie[]> = new Subject();
  movies$: Observable<Readonly<Movie[]>> = this.moviesSubject.asObservable();
  moviesLoadingSubject: Subject<boolean> = new Subject();
  moviesLoading$: Observable<boolean> = this.moviesLoadingSubject.asObservable();

  constructor(
    private moviesService: MoviesService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  searchMovies({ keyword }: { keyword: string }) {
    if (!keyword) {
      this.moviesSubject.next([]);
      return;
    }

    this._snackBar.dismiss();
    this.moviesLoadingSubject.next(true);

    this.moviesService.searchMovies(keyword)
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

  getSimilarMovies(movieId: number) {
    this.searchType = SearchType.SIMILAR;
    this.moviesLoadingSubject.next(true);
    this.moviesService.getSimilarMovies(movieId)
      .subscribe({
        next: data => {
          this.moviesSubject.next(data);
          this.moviesLoadingSubject.next(false);
        },
        error: error => {
          console.error(error);
          this._snackBar.open('Failed to load related movies', 'Close', { panelClass: 'error-snackbar'});
          this.moviesLoadingSubject.next(false);
        },
      });
  }

  openDetailsPopup(data: { movieId: number }) {
    const dialogRef = this.dialog.open(MovieDetailDialogComponent, {
      data,
      maxHeight: '80dvh',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
    });

    this.selectMovieForSimilarSubscription?.unsubscribe();
    this.selectMovieForSimilarSubscription = dialogRef.componentInstance.selectMovieForSimilars
      .subscribe(({ movieId, movieName }) => {
        this.relatedKeyword = movieName;
        this.getSimilarMovies(movieId);
      });
  }

  searchTypeChanged(newSearchType: SearchType) {
    this.searchType = newSearchType;
  }

  ngOnDestroy(): void {
    this.selectMovieForSimilarSubscription?.unsubscribe();
  }
}
