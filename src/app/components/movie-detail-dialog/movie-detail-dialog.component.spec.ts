import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApolloQueryResult } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventEmitter } from '@angular/core';

import { MovieDetailDialogComponent } from './movie-detail-dialog.component';
import { GraphQLModule } from '../../graphql.module';
import { Movie } from '../../models/movie';
import { getMockMovie } from '../../test-utils/mock-movies';
import { getWikiResponse } from '../../test-utils/mock-wiki-response';
import { getErrorResponse } from '../../test-utils/mock-response';

describe('MovieDetailDialogComponent', () => {
  let component: MovieDetailDialogComponent;
  let fixture: ComponentFixture<MovieDetailDialogComponent>;
  let apolloQueryMock: jest.SpyInstance;
  let httpGetMock: jest.SpyInstance;

  const mockApolloQuery = () => {
    const mockGraphqlReturnValue = {
      data: { movie: getMockMovie() }
    } as ApolloQueryResult<{ movie: Movie }>;
    const apolloQuerySpy = jest.spyOn(TestBed.inject(Apollo), 'query');
    apolloQuerySpy.mockReturnValue(of(mockGraphqlReturnValue));
    return apolloQuerySpy;
  }

  const mockAsyncServices = () => {
    const apolloQuerySpy = mockApolloQuery();
    const httpGetSpy = jest.spyOn(TestBed.inject(HttpClient), 'get');
    httpGetSpy.mockReturnValue(of(getWikiResponse()));

    httpGetMock = httpGetSpy;
    apolloQueryMock = apolloQuerySpy;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieDetailDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {}}  },
        { provide: MAT_DIALOG_DATA, useValue: { movieId: 123 } },
      ],
      imports: [
        BrowserAnimationsModule,
        MatListModule,
        MatDialogModule,
        MatButtonModule,
        MatCardModule,
        MatSnackBarModule,
        MatDialogModule,
        HttpClientTestingModule,
        GraphQLModule,
        MatIconModule,
      ],
      teardown: { destroyAfterEach: false }
    })
    .compileComponents();

    mockAsyncServices();
    fixture = TestBed.createComponent(MovieDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    mockAsyncServices();
    expect(component).toBeTruthy();
  });

  describe('when component loads', () => {
    it('fetches movie', (done) => {
      setTimeout(() => {
        try {
          expect(apolloQueryMock).toHaveBeenCalled();
          done();
        } catch (err) {
          done(err);
        }
      }, 0);
    });

    describe('when movie fetching has error', () => {
      it('shows snackbar', (done) => {
        const apolloQueryMock = jest.spyOn(TestBed.inject(Apollo), 'query');
        apolloQueryMock.mockReturnValue(getErrorResponse());

        const snackOpenMock = jest.spyOn(TestBed.inject(MatSnackBar), 'open');
        jest.spyOn(console, 'error').mockImplementation(() => {});
  
        fixture = TestBed.createComponent(MovieDetailDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
  
        setTimeout(() => {
          try {
            expect(snackOpenMock).toHaveBeenCalled();
            done();
          } catch (err) {
            done(err);
          }
        }, 0);
      });
    });

    describe('when fetch movie description', () => {
      it('fetches movie description', (done) => {
        setTimeout(() => {
          try {
            expect(httpGetMock).toHaveBeenCalled();
            done();
          } catch (err) {
            done(err);
          }
        }, 0);
      });

      describe('when movie descripiton fetching has error', () => {
        it('shows snackbar', (done) => {
          const httpGetMock = jest.spyOn(TestBed.inject(HttpClient), 'get');
          httpGetMock.mockReturnValue(getErrorResponse());
          const snackOpenMock = jest.spyOn(TestBed.inject(MatSnackBar), 'open');
          jest.spyOn(console, 'error').mockImplementation(() => {});
    
          fixture = TestBed.createComponent(MovieDetailDialogComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
    
          setTimeout(() => {
            try {
              expect(snackOpenMock).toHaveBeenCalled();
              done();
            } catch (err) {
              done(err);
            }
          }, 0);
        });
      });
      
      it('replaces html elements in string', (done) => {
        setTimeout(() => {
          try {
            expect(component.wikiDetails?.snippet).toBe('This is a snippet for the page');
            done();
          }
          catch (err) {
            done(err);
          }
        }, 0);
      });
    });
  });

  describe('when clicks on check on imdb button', () => {
    it('opens the page with noopener,noreferrer params', (done) => {
      const windowOpenMock = jest.spyOn(window, 'open')
        .mockImplementation(() => ({} as Window));

      setTimeout(() => {
        try {
          const imdbButton = fixture.debugElement.query(By.css('#check-on-imdb-button')).nativeElement;
          imdbButton.click();
    
          expect(windowOpenMock).toHaveBeenCalledWith('IMDB_URL', '_blank', 'noopener,noreferrer');
          done();
        } catch (err) {
          done(err);
        }
      }, 0);
    });
  });

  describe('when clicks on check on wikipedia button', () => {
    it('opens the page with noopener,noreferrer params', (done) => {
      const windowOpenMock = jest.spyOn(window, 'open')
        .mockImplementation(() => ({} as Window));

      setTimeout(() => {
        try {
          const wikiButton = fixture.debugElement.query(By.css('#check-on-wiki-button')).nativeElement;
          wikiButton.click();
    
          expect(windowOpenMock)
            .toHaveBeenCalledWith(
              'https://en.wikipedia.org/?curid=1',
              '_blank',
              'noopener,noreferrer',
            );
          done();
        } catch (err) {
          done(err);
        }
      }, 0);
    });
  });

  describe('when clicks on check related movies', () => {
    it('emits a selectMovieForSimilars event', (done) => {
      const eventEmitter = new EventEmitter<{ movieId: number; movieName: string }>();
      const eventEmitterSpy = jest.spyOn(eventEmitter, 'emit');

      component.selectMovieForSimilars = eventEmitter;
      fixture.detectChanges();
      
      setTimeout(() => {
        try {
          const checkRelatedButton = fixture.debugElement.query(By.css('#check-related-button')).nativeElement;
          checkRelatedButton.click();
    
          const movie = getMockMovie(); 
          expect(eventEmitterSpy).toHaveBeenCalledWith({ movieId: movie.id, movieName: movie.name });
          done();
        } catch (err) {
          done(err);
        }
      }, 0);
    });

    it('closes the dialog', (done) => {
      const closeDialogSpy = jest.spyOn(TestBed.inject(MatDialogRef<MovieDetailDialogComponent>), 'close');
      
      setTimeout(() => {
        try {
          const checkRelatedButton = fixture.debugElement.query(By.css('#check-related-button')).nativeElement;
          checkRelatedButton.click();

          expect(closeDialogSpy).toHaveBeenCalledWith();
          done();
        } catch (err) {
          done(err);
        }
      }, 0);
    });
  })
});
