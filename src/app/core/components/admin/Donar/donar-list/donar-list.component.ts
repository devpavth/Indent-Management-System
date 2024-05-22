import { Component, OnInit } from '@angular/core';
import { DonarService } from '../../../service/Donar/donar.service';

@Component({
  selector: 'app-donar-list',
  templateUrl: './donar-list.component.html',
  styleUrl: './donar-list.component.css',
})
export class DonarListComponent implements OnInit {
  _donar: any;
  isDonorView: boolean = false;
  donorId: any;
  constructor(private donorService: DonarService) {}
  ngOnInit() {
    this.fetchAllDonor();
  }

  fetchAllDonor() {
    this.donorService.getAllDonor().subscribe((res) => {
      this._donar = res;
    });
  }

  viewDonar(data: any) {
    this.donorId = data;
    this.isDonorView = true;
  }
  close(data: boolean) {
    this.isDonorView = data;
  }
}
