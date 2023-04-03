import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchType } from '../../enums/search-type';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss']
})
export class SearchCardComponent {
  form = new FormGroup({
    keyword: new FormControl('fight club', Validators.required),
  });
  SearchType = SearchType;

  _searchType!: SearchType;
  get searchType() {
    return this._searchType;
  }

  @Input()
  set searchType(value: SearchType) {
    if (value === SearchType.SIMILAR) {
      this.form.disable();
    } else {
      this.form.enable();
    }
    this._searchType = value;
  }

  @Input()
  moviesLoading: boolean | null = false;

  @Input()
  set relatedKeyword(value: string | undefined) {
    if (value) {
      this.form.controls.keyword.setValue(value);
      this.form.disable();
    }
  }

  @Output()
  searchMoviesSubmit = new EventEmitter<{ keyword: string }>();

  @Output()
  searchTypeChanged = new EventEmitter<SearchType>();

  resetKeyword() {
    this.form.reset();
    this.form.controls.keyword.enable();
    this.searchTypeChanged.emit(SearchType.REGULAR);
    this.searchMoviesSubmit.emit({ keyword: '' });
  }

  searchSubmit(event: Event) {
    event.preventDefault();
    this.searchMoviesSubmit.emit({ keyword: this.form.controls.keyword.value || '' });
  }
}
