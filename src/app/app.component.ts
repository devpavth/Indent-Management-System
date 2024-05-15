import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Indent';
  VisiableLogin: boolean = true;
  Visiable: boolean = false;
  ngOnInit(): void {
    initFlowbite();
  }
}
