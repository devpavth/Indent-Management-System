import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchItem',
})
export class SearchItemPipe implements PipeTransform {
  transform(value: any[], searchText: string): any[] {
    if (!value || !searchText) {
      return value;
    }
    searchText = searchText.toLowerCase();
    return value.filter((item) =>
      this.itemContainsSearchText(item, searchText),
    );
  }

  private itemContainsSearchText(item: any, searchText: string): boolean {
    for (const key in item) {
      if (
        item.hasOwnProperty(key) &&
        typeof item[key] === 'string' &&
        item[key].toLowerCase().includes(searchText)
      ) {
        return true;
      }
    }
    return false;
  }
}
