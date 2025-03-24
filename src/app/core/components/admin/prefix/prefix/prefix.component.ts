import {
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../../../service/Request/request.service';
import { Prefix } from '../../../../models/prefix/prefix.model';

@Component({
  selector: 'app-prefix',
  templateUrl: './prefix.component.html',
  styleUrl: './prefix.component.css',
})
export class PrefixComponent {
  @Output() close = new EventEmitter<boolean>();
  isStyle: boolean = false;
  selectedTab: number = 0;

  route = inject(Router);
  requestService = inject(RequestService);

  tabs: string[] = ['Purchase Order', 'Indent Code', 'Product Transaction'];

  POPrefixData: Prefix | undefined;

  ngOnInit() {
    console.log('Opening Prefix Component');

    this.fetchPOMockPrefixCode(2);
  }

  fetchPOMockPrefixCode(POCode: number) {
    this.requestService.fetchPOPrefixCode(POCode).subscribe(
      (res: Prefix) => {
        console.log('fetching POMock Prefix Code:', res);
        this.POPrefixData = res;
      },
      (error) => {
        console.log('error while fetching PO Mock Prefix Code', error);
      },
    );
  }

  toggleBranch() {
    if (this.POPrefixData) {
      this.POPrefixData.branch = !this.POPrefixData.branch;
    }
  }

  toggleDept(){
    if(this.POPrefixData){
      this.POPrefixData.dept = !this.POPrefixData.dept;
    }
  }

  closePrefix() {
    this.close.emit(true);
  }
}
