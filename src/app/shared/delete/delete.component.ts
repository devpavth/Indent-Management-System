import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FunderService } from '../../core/components/service/Funder/funder.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css',
})
export class DeleteComponent {
  @Input() deleteData: any;
  @Output() close = new EventEmitter<boolean>();

  constructor(private funderService: FunderService) {}

  deleteFunction() {
    if (this.deleteData.action == 1) {
      console.log(this.deleteData);
      this.funderService.deleteFunder(this.deleteData.deleteId).subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          if (error.status == 200) {
            this.close.emit(false);
          }
        },
      );
    }
  }
}
