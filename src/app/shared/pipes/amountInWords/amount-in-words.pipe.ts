import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amountInWords',
})
export class AmountInWordsPipe implements PipeTransform {
  private a = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];

  private b = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];

  transform(num: number): string {
    // if(num.toString().length > 12) return 'Amount too large';

    const numStr = num.toFixed(2);
    const parts = numStr.split('.');
    const rupees = parseInt(parts[0], 10);
    const paisa = Math.round(parseFloat('0.' + parts[1]) * 100);

    const n = ('000000000' + rupees)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);

    if(!n) return '';

    let str = '';

    str += Number(n[1]) !== 0 ? (this.a[Number(n[1])] || this.b[Number(n[1][0])] + ' ' + this.a[Number(n[1][1])]) + ' crore ' : '';
    str += Number(n[2]) !== 0 ? (this.a[Number(n[2])] || this.b[Number(n[2][0])] + ' ' + this.a[Number(n[2][1])]) + ' lakh ' : '';
    str += Number(n[3]) !== 0 ? (this.a[Number(n[3])] || this.b[Number(n[3][0])] + ' ' + this.a[Number(n[3][1])]) + ' thousand ' : '';
    str += Number(n[4]) !== 0 ? (this.a[Number(n[4])] || this.b[Number(n[4][0])] + ' ' + this.a[Number(n[4][1])]) + ' hundred ' : '';

    if(str !== '') str += 'and ';

    str +=
      Number(n[5]) !== 0
        ? (this.a[Number(n[5])] ||
            this.b[Number(n[5][0])] + ' ' + this.a[Number(n[5][1])]) +
          ' Rupees '
        : '';

    if(paisa !== 0){
      str +=
        'and ' +
        (this.a[paisa] ||
          this.b[Math.floor(paisa / 10)] + ' ' + this.a[paisa % 10]) +
        ' Paisa ';
    }

    str += 'only';

    return str.replace(/\sundefined/g , '');
  }
}
