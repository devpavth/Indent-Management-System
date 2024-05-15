import { Component, EventEmitter, Output } from '@angular/core';
import { AdminProductServiceService } from '../../admin-services/admin-product-service.service';
import { EmployeeServiceService } from '../../../service/Employee/employee-service.service';

@Component({
  selector: 'app-delete-pop',
  templateUrl: './delete-pop.component.html',
  styleUrl: './delete-pop.component.css',
})
export class DeletePopComponent {
  @Output() closeDeletePop = new EventEmitter<number>();
  constructor(
    private AdminService: AdminProductServiceService,
    private readonly EmployeeService: EmployeeServiceService,
  ) {}
}
