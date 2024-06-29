import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrl: './auto-complete.component.css',
})
export class AutoCompleteComponent<T> {
  @Input() suggestions: T[] = [];
  @Input() displayFields: (keyof T)[] = [];
  @Output() selectionChanged = new EventEmitter<T>();
  query: string = '';
  filteredSuggestions: T[] = [];
  show: boolean = false;

  onInput() {
    const queryLower = this.query.toLowerCase();
    if (queryLower) {
      this.filteredSuggestions = this.suggestions.filter((suggestion) =>
        this.displayFields.some((field) => {
          const value = suggestion[field];
          return (
            typeof value === 'string' &&
            value.toLowerCase().includes(queryLower)
          );
        }),
      );
    } else {
      this.filteredSuggestions = this.suggestions?.slice();
    }
    this.show = true;
  }

  selectSuggestion(suggestion: T) {
    this.query = this.getDisplayValue(suggestion);
    this.show = false;
    this.handleSelection(suggestion);
  }

  hideSuggestions() {
    setTimeout(() => {
      this.show = false;
    }, 200); // Delay to allow click event to register
  }

  showSuggestions() {
    if (this.query.trim() === '') {
      this.filteredSuggestions = this.suggestions?.slice();
    }
    this.show = true;
  }

  handleSelection(suggestion: T) {
    this.selectionChanged.emit(suggestion);
  }

  getDisplayValue(suggestion: T): string {
    return this.displayFields.map((field) => suggestion[field]).join(' - ');
  }

  highlight(text: string): string {
    const query = this.query.toLowerCase();
    if (!query) {
      return text;
    }
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}
