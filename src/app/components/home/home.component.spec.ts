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

import { HomeComponent } from './home.component';
import { Movie } from '../../models/movie';
import { getMockMovies } from '../../test-utils/mock-movies';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
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
      const mockGraphqlReturnValue = { data: getMockMovies() } as ApolloQueryResult<Movie[]>;
      const apolloQueryMock = jest.spyOn(Apollo.prototype, 'query');
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

    it('renders to the UI', () => {
      const mockGraphqlReturnValue = { data: getMockMovies() } as ApolloQueryResult<Movie[]>;
      const apolloQueryMock = jest.spyOn(Apollo.prototype, 'query');
      apolloQueryMock.mockReturnValue(of(mockGraphqlReturnValue))

      const input = fixture.debugElement.query(By.css('#movie-name-input')).nativeElement;
      input.value = 'A movie name';
      input.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      
      const form = fixture.debugElement.query(By.css('#movie-search-form')).nativeElement;
      form.submit();
      fixture.detectChanges();
  
      setTimeout(() => {
        fixture.detectChanges();
        const moviesContainer = fixture.debugElement.query(By.css('#movies-container')).nativeElement;

        expect(apolloQueryMock).toHaveBeenCalled();
        expect(moviesContainer).toBeTruthy();
        expect(moviesContainer.querySelectorAll('div').length).toBe(1);
        expect(moviesContainer.querySelectorAll('div').innerText).toBe('Mock movie name');
      }, 0);
    });
  });
});
