import { Component } from '@angular/core';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrl: './left-menu.component.css',
})
export class LeftMenuComponent {
  viewRequestlist: boolean = true;
  tRequest: boolean = false;
  tAdmin: boolean = false;
  procurement: boolean = false;
  poapproval: boolean = false;
  finance: boolean = false;
  toggleRequest() {
    this.tRequest = !this.tRequest;
  }
  toggleAdmin() {
    this.tAdmin = !this.tAdmin;
  }
}
