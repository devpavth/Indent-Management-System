import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dpPic',
})
export class DpPicPipe implements PipeTransform {
  transform(value: any): any {
    if (!value || typeof value !== 'string' || value.length < 2) {
      return '';
    }

    const firstLetter = value.charAt(0);
    const lastLetter = value.charAt(value.length - 1);

    return `${firstLetter}${lastLetter}`;
  }
}
