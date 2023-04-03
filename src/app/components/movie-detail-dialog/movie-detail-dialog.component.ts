import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Observable } from 'rxjs';
import { Movie } from '../../models/movie';
import { MoviesService } from '../../services/movie.service';
import { WikiDetails } from '../../models/wiki-details';

@Component({
  selector: 'app-movie-detail-dialog',
  templateUrl: './movie-detail-dialog.component.html',
  styleUrls: ['./movie-detail-dialog.component.scss']
})
export class MovieDetailDialogComponent {
  movie: Movie | undefined;
  wikiDetails?: WikiDetails;
  wikiPageId?: number;

  isLoadingSubject: Subject<boolean> = new Subject();
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  constructor(
    private movieService: MoviesService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MovieDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { movieId: number },
  ) {
    this.getMovie(this.data.movieId);
  }
  
  onCloseClick(): void {
    this.dialogRef.close();
  }

  getMovie(movieId: number) {
    this.isLoadingSubject.next(true);
    this.movieService.getMovieById(movieId).subscribe({
      next: (movie) => {
        this.isLoadingSubject.next(false);
        this.movie = movie;
        this.getMovieDescription(this.movie.name, this.movie.releaseDate);
      },
      error: error => {
        console.error(error);
        this.isLoadingSubject.next(false);
        this._snackBar.open('Failed to load movie', 'Close', { panelClass: 'error-snackbar'});
      },
    });
  }

  getMovieDescription(movieName: string, releaseDate: Date) {
    this._snackBar.dismiss();
    this.isLoadingSubject.next(true);

    this.movieService.getMovieDescription(movieName, releaseDate)
      .subscribe({
        next: wikiDetails => {
          this.isLoadingSubject.next(false);
          if (wikiDetails) {
            this.wikiDetails = wikiDetails;
            this.wikiPageId = Number.isInteger(this.wikiDetails.pageid) ? this.wikiDetails.pageid : undefined;
          }
        },
        error: error => {
          console.error(error);
          this.isLoadingSubject.next(false);
          this._snackBar.open('Failed to load movie details', 'Close', { panelClass: 'error-snackbar'});
        },
      });
  }

  goToImdbPage() {
    if (!this.movie?.socialMedia.imdb) return;

    window.open(this.movie.socialMedia.imdb, '_blank', 'noopener,noreferrer');
  }

  goToWikiPage() {
    if (!this.wikiPageId) return;

    window.open(`https://en.wikipedia.org/?curid=${this.wikiPageId}`, '_blank', 'noopener,noreferrer');
  }
}
