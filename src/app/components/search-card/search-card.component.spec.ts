import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { SearchCardComponent } from './search-card.component';
import { SearchType } from '../../enums/search-type';

describe('SearchCardComponent', () => {
  let component: SearchCardComponent;
  let fixture: ComponentFixture<SearchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchCardComponent ],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchCardComponent);
    component = fixture.componentInstance;
    fixture.componentInstance.searchType = SearchType.REGULAR;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when search type is regular', () => {
    beforeEach(() => {
      component.searchType = SearchType.REGULAR;
    });

    describe('when clicks on input\'s clear icon', () => {
      it('clears keyword formcontrol', () => {
        const inputDebugEl = fixture.debugElement.query(By.css('#movie-name-input'));
        const input = inputDebugEl.nativeElement;
        input.value = 'A movie name';
        inputDebugEl.triggerEventHandler('input', { target: input });
        fixture.detectChanges();

        expect(component.form.controls.keyword.value).toBe('A movie name');
        const clearButton = fixture.debugElement.query(By.css('button[aria-label="Clear"]')).nativeElement;
        clearButton.click();

        expect(component.form.controls.keyword.value).toBe(null);
      });
    });

    describe('when click on submit button', () => {
      it('emits searchMoviesSubmit event', () => {
        const eventEmitter = new EventEmitter<{ keyword: string }>();
        const eventEmitterSpy = jest.spyOn(eventEmitter, 'emit');
        component.searchMoviesSubmit = eventEmitter;

        const inputDebugEl = fixture.debugElement.query(By.css('#movie-name-input'));
        const input = inputDebugEl.nativeElement;
        input.value = 'A movie name';
        inputDebugEl.triggerEventHandler('input', { target: input });
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('#movie-name-search-button')).nativeElement;
        button.click();

        expect(eventEmitterSpy).toHaveBeenCalledWith({ keyword: 'A movie name' });
      });
    });
  });

  describe('when search type is similar', () => {
    beforeEach(() => {
      component.searchType = SearchType.SIMILAR;
      component.relatedKeyword = 'A related movie name';
      fixture.detectChanges();
    });

    it('disables input', () => {
      const inputDebugEl = fixture.debugElement.query(By.css('#movie-name-input'));
      const input = inputDebugEl.nativeElement;

      expect(input.disabled).toBe(true);
    });

    it('disables input\'s clear button', () => {
      const buttonDebugEl = fixture.debugElement.query(By.css('#movie-name-input-clear'));
      const button = buttonDebugEl.nativeElement;

      expect(button.disabled).toBe(true);
    });

    it('disables the submit button', () => {
      const buttonDebugEl = fixture.debugElement.query(By.css('#movie-name-search-button'));
      const button = buttonDebugEl.nativeElement;

      expect(button.disabled).toBe(true);
    });
    
    it('shows clear regular search button', () => {
      const buttonDebugEl = fixture.debugElement.query(By.css('#switch-regular-search-button'));
      expect(buttonDebugEl).toBeTruthy();

      const button = buttonDebugEl.nativeElement;
      expect(button.disabled).toBeFalsy();
    });

    describe('when click on clear regular search button', () => {
      let searchTypeChangedSubsription: Subscription;

      beforeEach(() => {
        component.searchTypeChanged = new EventEmitter<SearchType>();
        if (searchTypeChangedSubsription) {
          searchTypeChangedSubsription.unsubscribe();
        }
        searchTypeChangedSubsription = component.searchTypeChanged
          .subscribe((searchType) => {
            component.searchType = searchType;
            fixture.detectChanges();
          });
      });

      it('emits searchTypeChange event and hides the clear regular search button on the new search Type', () => {
        const clearRelatedButtonDebugEl = fixture.debugElement.query(By.css('#switch-regular-search-button'));
        const clearRelatedButton = clearRelatedButtonDebugEl.nativeElement;
        clearRelatedButton.click();
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('#switch-regular-search-button'))).toBeFalsy();
      });

      it('emits searchTypeChange event and enables input on the new search Type', () => {
        const clearRelatedButtonDebugEl = fixture.debugElement.query(By.css('#switch-regular-search-button'));
        const clearRelatedButton = clearRelatedButtonDebugEl.nativeElement;
        clearRelatedButton.click();
        fixture.detectChanges();

        const inputDebugEl = fixture.debugElement.query(By.css('#movie-name-input'));
        const input = inputDebugEl.nativeElement;
  
        expect(input.disabled).toBeFalsy();
      });
  
      it('emits searchTypeChange event and enables input\'s clear button on the new search Type', () => {
        const clearRelatedButtonDebugEl = fixture.debugElement.query(By.css('#switch-regular-search-button'));
        const clearRelatedButton = clearRelatedButtonDebugEl.nativeElement;
        clearRelatedButton.click();
        fixture.detectChanges();

        const inputDebugEl = fixture.debugElement.query(By.css('#movie-name-input'));
        const input = inputDebugEl.nativeElement;
        input.value = 'A movie name';
        inputDebugEl.triggerEventHandler('input', { target: input });
        fixture.detectChanges();

        const buttonDebugEl = fixture.debugElement.query(By.css('#movie-name-input-clear'));
        const button = buttonDebugEl.nativeElement;
  
        expect(button.disabled).toBeFalsy();
      });
  
      it('emits searchTypeChange event and enables the submit button on the new search Type', () => {
        const clearRelatedButtonDebugEl = fixture.debugElement.query(By.css('#switch-regular-search-button'));
        const clearRelatedButton = clearRelatedButtonDebugEl.nativeElement;
        clearRelatedButton.click();
        fixture.detectChanges();

        const buttonDebugEl = fixture.debugElement.query(By.css('#movie-name-search-button'));
        const button = buttonDebugEl.nativeElement;
  
        expect(button.disabled).toBeFalsy();
      });
    });
  });
});
