import { Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Router } from '@angular/router';
import { ToastService } from './core/components/service/toast/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Indent';
  VisiableLogin: boolean = true;
  Visiable: boolean = false;

  // toastService = inject(ToastService);

  ngOnInit(): void {
    initFlowbite();
  }
}
