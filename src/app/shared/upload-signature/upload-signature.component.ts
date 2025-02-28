import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeServiceService } from '../../core/components/service/Employee/employee-service.service';

@Component({
  selector: 'app-upload-signature',
  templateUrl: './upload-signature.component.html',
  styleUrl: './upload-signature.component.css',
})
export class UploadSignatureComponent {
  @Input() specialRoleId: number | undefined;
  @Output() close = new EventEmitter<boolean>();
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  empService = inject(EmployeeServiceService);

  route = inject(Router);
  isToast: boolean = false;
  successToastMsg: string = '';
  isErrorToast: boolean = false;
  errorToastMsg: string = '';

  ngOnInit() {
    console.log('specialRoleId:', this.specialRoleId);
  }

  onClose() {
    this.close.emit(true);
  }

  onFileSelected(event: Event) {
    console.log('specialRoleId in file selected:', this.specialRoleId);
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      // this.selectedFile = input.files[0];

      const allowedExtensions = ['image/jpeg', 'image/png', 'image/jpg'];

      if (!allowedExtensions.includes(file.type)) {
        // alert('Invalid file format! Please upload a JPG, JPEG, or PNG image.');
        this.isErrorToast = true;
        this.errorToastMsg = "Invalid file format! Please upload a JPG, JPEG, or PNG image.";
        this.previewUrl = null;
        this.selectedFile = null;
        setTimeout(() => {
          this.isErrorToast = false;
        }, 3000);

        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadSignature() {
    console.log('specialRoleId:', this.specialRoleId);
    if (this.specialRoleId === undefined || this.specialRoleId === null) {
      console.error('specialRoleId is required!');
      // alert('Special Role ID is missing.');
      return;
    }

    if (!this.selectedFile) {
      console.error('No file selected!');
      // alert('Please select a file first.');
      return;
    }
    const formData = new FormData();
    formData.append('specialRoleId', this.specialRoleId.toString());
    formData.append('signature', this.selectedFile, this.selectedFile.name);

    for (const pair of (formData as any).entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    this.empService.uploadSignature(formData).subscribe(
      (res: any) => {
        console.log('successfully uploaded signature:', res);
        // this.close.emit(true);
        this.isToast = true;
        this.successToastMsg = res.errorMessege;
        setTimeout(() => {
          this.isToast = false;
          this.close.emit(true);
        }, 3000);
      },
      (error) => {
        console.log('error while uploading signature:', error);
      },
    );
  }
}
