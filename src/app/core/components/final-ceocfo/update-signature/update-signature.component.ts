import { Component, inject } from '@angular/core';
import { EmployeeServiceService } from '../../service/Employee/employee-service.service';

@Component({
  selector: 'app-update-signature',
  templateUrl: './update-signature.component.html',
  styleUrl: './update-signature.component.css',
})
export class UpdateSignatureComponent {
  signatureImage: string | ArrayBuffer | null = null;
  userId: string | null = '';
  designationName: string = '';
  isViewUploadSignature: boolean = false;
  specialRoleId: number = 0;

  empService = inject(EmployeeServiceService);

  ngOnInit() {
    this.userId = sessionStorage.getItem('userId');

    this.empService.getEmployeeDetails(this.userId).subscribe(
      (res: any) => {
        console.log('fetching employee details:', res);
        this.designationName = res.empDesignation;
        this.specialRoleId = res.specialRoleId;
      },
      (error) => {
        console.log('error while employee details:', error);
      },
    );

    this.fetchUploadedSignature();
  }

  fetchUploadedSignature() {
    this.empService.fetchUploadedSignature().subscribe(
      (blob) => {
        console.log('fetching uploaded signature:', blob);
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          this.signatureImage = reader.result;
        };
      },
      (error) => {
        console.log('error while fetching uploaded signature:', error);
      },
    );
  }

  updateSpecialRoleSiganture() {
    this.isViewUploadSignature = true;
  }

  clearUploadSignature(closeIcon: boolean) {
    this.isViewUploadSignature = !closeIcon;
  }
}
