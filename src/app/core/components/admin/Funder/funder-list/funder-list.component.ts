import { Component } from '@angular/core';

@Component({
  selector: 'app-funder-list',
  templateUrl: './funder-list.component.html',
  styleUrl: './funder-list.component.css',
})
export class FunderListComponent {
  isFunderList: Boolean = false;
  closeView(close: Boolean) {
    this.isFunderList = close;
  }
}
