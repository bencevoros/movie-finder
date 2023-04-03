import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieListComponent } from './movie-list.component';
import { MatListModule } from '@angular/material/list';
import { getMockMovies } from '../../test-utils/mock-movies';
import { By } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';

describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieListComponent ],
      imports: [MatListModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    component.movies = getMockMovies();
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates list', () => {
    const item = fixture.debugElement.query(By.css('mat-list-item')).nativeElement;
    expect(item.innerHTML.includes(getMockMovies()[0].name)).toBeTruthy();
  });

  describe('when movie title clicked', () => {
    it('emits open details event', () => {
      const spiedEmit = jest.spyOn(component.openMovieDetails, 'emit');
      const item = fixture.debugElement.query(By.css('mat-list-item')).nativeElement;
      item.click();
      fixture.detectChanges();
  
      expect(spiedEmit).toHaveBeenCalledWith({ movieId: 1 });
    });
  });
});
