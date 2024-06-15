import { Component, OnInit } from '@angular/core';
import { FunderService } from '../../../service/Funder/funder.service';

@Component({
  selector: 'app-funder-list',
  templateUrl: './funder-list.component.html',
  styleUrl: './funder-list.component.css',
})
export class FunderListComponent implements OnInit {
  isFunderList: Boolean = false;
  funderData: any;

  funderList: any;
  constructor(private funderService: FunderService) {}
  ngOnInit() {
    this.getAllFunderList();
  }

  getAllFunderList() {
    this.funderService.funderList().subscribe((res) => {
      this.funderList = res;
      console.log(res);
    });
  }

  toggleView(action: Boolean, check: number, funderData: any) {
    if (check == 1) {
      this.isFunderList = action;
      this.funderData = funderData;
    }
    if (check == 0) {
      this.isFunderList = action;
      this.getAllFunderList();
    }
  }
}
