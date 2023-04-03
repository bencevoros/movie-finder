import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GraphQLModule } from '../../graphql.module';
import { By } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import { HttpClientModule } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

import { HomeComponent } from './home.component';
import { Movie } from '../../models/movie';
import { getMockMovieWithSimilar, getMockMovies } from '../../test-utils/mock-movies';
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component';
import { MovieListComponent } from '../movie-list/movie-list.component';
import { SearchCardComponent } from '../search-card/search-card.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        MovieListComponent,
        SearchCardComponent,
      ],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        GraphQLModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        MatSnackBarModule,
        MatListModule,
        MatDialogModule,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when fetch movies', () => {
    it('shows spinner', () => {
      const mockGraphqlReturnValue = { data: { searchMovies: getMockMovies() } } as ApolloQueryResult<{ searchMovies: Movie[] }>;
      const apolloQueryMock = jest.spyOn(TestBed.inject(Apollo), 'query');
      apolloQueryMock.mockReturnValue(of(mockGraphqlReturnValue).pipe(delay(1000)))

      const input = fixture.debugElement.query(By.css('#movie-name-input')).nativeElement;
      input.value = 'A movie name';
      input.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      
      const form = fixture.debugElement.query(By.css('#movie-search-form')).nativeElement;
      form.submit();
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('#movie-name-search-button')).nativeElement;
      
      expect(apolloQueryMock).toHaveBeenCalled();
      expect(button.querySelector('mat-icon')).toBeTruthy();
    });

    it('renders to the UI', (done) => {
      const mockGraphqlReturnValue = { data: { searchMovies: getMockMovies() } } as ApolloQueryResult<{ searchMovies: Movie[] }>;
      const apolloQueryMock = jest.spyOn(TestBed.inject(Apollo), 'query');
      apolloQueryMock.mockReturnValue(of(mockGraphqlReturnValue))

      const input = fixture.debugElement.query(By.css('#movie-name-input')).nativeElement;
      input.value = 'A movie name';
      input.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      
      const form = fixture.debugElement.query(By.css('#movie-search-form')).nativeElement;
      form.submit();
      fixture.detectChanges();
  
      setTimeout(() => {
        try {
          fixture.detectChanges();
          const moviesContainer = fixture.debugElement.query(By.css('#movies-container')).nativeElement;
  
          expect(apolloQueryMock).toHaveBeenCalled();
          expect(moviesContainer).toBeTruthy();
          expect(moviesContainer.querySelectorAll('app-movie-list').length).toBe(1);
          done();
        }
        catch (err) {
          done(err);
        }
      }, 1000);
    });
  });

  describe('when call openDetailsPopup', () => {
    it('opens the detail popup', () => {
      const selectMovieForSimilarsMock = of({ movieId: 1, movieName: 'A movie name' });
      const spiedDialogOpen = jest.spyOn(TestBed.inject(MatDialog), 'open')
        .mockImplementation(() => ({
          componentInstance: { selectMovieForSimilars: selectMovieForSimilarsMock },
        } as MatDialogRef<unknown, unknown>));
      component.openDetailsPopup({ movieId: 123 });
      expect(spiedDialogOpen).toHaveBeenCalledWith(MovieDetailDialogComponent, {
        data: { movieId: 123 },
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        maxHeight: '80dvh',
      });
    });
  });

  describe('when call getSimilarMovies', () => {
    it('shows spinner', () => {
      const mockGraphqlReturnValue = {
        data: { movie: getMockMovieWithSimilar() }
      } as ApolloQueryResult<{ movie: Movie }>;
      const apolloQueryMock = jest.spyOn(TestBed.inject(Apollo), 'query');
      apolloQueryMock.mockReturnValue(of(mockGraphqlReturnValue).pipe(delay(1000)))

      component.getSimilarMovies(1);
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('#movie-name-search-button')).nativeElement;
      
      expect(apolloQueryMock).toHaveBeenCalled();
      expect(button.querySelector('mat-icon')).toBeTruthy();
    });

    it('renders to the UI', (done) => {
      const mockGraphqlReturnValue = {
        data: { movie: getMockMovieWithSimilar() }
      } as ApolloQueryResult<{ movie: Movie }>;
      const apolloQueryMock = jest.spyOn(TestBed.inject(Apollo), 'query');
      apolloQueryMock.mockReturnValue(of(mockGraphqlReturnValue))

      component.getSimilarMovies(1);
      fixture.detectChanges();
  
      setTimeout(() => {
        try {
          fixture.detectChanges();
          const moviesContainer = fixture.debugElement.query(By.css('#movies-container')).nativeElement;
  
          expect(apolloQueryMock).toHaveBeenCalled();
          expect(moviesContainer).toBeTruthy();
          expect(moviesContainer.querySelectorAll('app-movie-list').length).toBe(1);
          done();
        }
        catch (err) {
          done(err);
        }
      }, 1000);
    });
  });
});
