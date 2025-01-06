import { Component } from '@angular/core';

@Component({
  selector: 'app-inward-alert',
  templateUrl: './inward-alert.component.html',
  styleUrl: './inward-alert.component.css'
})
export class InwardAlertComponent {
  ngOnInit(){
    console.log("checking inward alert");
  }
}
