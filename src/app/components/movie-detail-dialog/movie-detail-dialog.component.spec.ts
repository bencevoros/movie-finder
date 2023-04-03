import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ApolloQueryResult } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

import { MovieDetailDialogComponent } from './movie-detail-dialog.component';
import { GraphQLModule } from '../../graphql.module';
import { Movie } from '../../models/movie';
import { getMockMovie } from '../../test-utils/mock-movies';
import { getWikiResponse } from '../../test-utils/mock-wiki-response';

describe('MovieDetailDialogComponent', () => {
  let component: MovieDetailDialogComponent;
  let fixture: ComponentFixture<MovieDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieDetailDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { movieId: 123 } },
      ],
      imports: [
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

    fixture = TestBed.createComponent(MovieDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockAsyncServices = () => {
    const mockGraphqlReturnValue = {
      data: { movie: getMockMovie() }
    } as ApolloQueryResult<{ movie: Movie }>;
    const apolloQueryMock = jest.spyOn(TestBed.inject(Apollo), 'query');
    apolloQueryMock.mockReturnValue(of(mockGraphqlReturnValue));
    const httpGetMock = jest.spyOn(TestBed.inject(HttpClient), 'get');
    httpGetMock.mockReturnValue(of(getWikiResponse()));

    return { httpGetMock, apolloQueryMock };
  }

  it('should create', () => {
    mockAsyncServices();
    expect(component).toBeTruthy();
  });

  describe('when component loads', () => {
    it('fetches movie', (done) => {
      const { apolloQueryMock } = mockAsyncServices();

      fixture = TestBed.createComponent(MovieDetailDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      setTimeout(() => {
        try {
          expect(apolloQueryMock).toHaveBeenCalled();
          done();
        } catch (err) {
          done(err);
        }
      }, 0);
    });

    describe('when fetch movie description', () => {
      it('fetches movie description', (done) => {
        const { httpGetMock } = mockAsyncServices();
        fixture = TestBed.createComponent(MovieDetailDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
  
        setTimeout(() => {
          try {
            expect(httpGetMock).toHaveBeenCalled();
            done();
          } catch (err) {
            done(err);
          }
        }, 0);
      });
      
      it('replaces html elements in string', (done) => {
        mockAsyncServices();

        fixture = TestBed.createComponent(MovieDetailDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

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
      mockAsyncServices();
      fixture = TestBed.createComponent(MovieDetailDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
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
      mockAsyncServices();
      fixture = TestBed.createComponent(MovieDetailDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
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
});
