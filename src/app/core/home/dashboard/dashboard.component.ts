import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from '../../components/service/shared-service/shared-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(public readonly shared: SharedServiceService) {}
  ngOnInit() {}
}
