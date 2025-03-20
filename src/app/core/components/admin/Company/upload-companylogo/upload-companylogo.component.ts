import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ToastService } from '../../../service/toast/toast.service';
import { BranchService } from '../../../service/Branch/branch.service';

@Component({
  selector: 'app-upload-companylogo',
  templateUrl: './upload-companylogo.component.html',
  styleUrl: './upload-companylogo.component.css',
})
export class UploadCompanylogoComponent {
  @Output() close = new EventEmitter<boolean>();
  @Output() logoUpdated = new EventEmitter<boolean>();

  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  toastService = inject(ToastService);
  branchService = inject(BranchService);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      const allowedExtensions = ['image/png'];
      const maxSizeInMB = 1;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (!allowedExtensions.includes(file.type)) {
        this.toastService.showError(
          'Invalid file format! Please upload a PNG image.',
        );

        this.previewUrl = null;
        this.selectedFile = null;

        return;
      }

      if (file.size > maxSizeInBytes) {
        this.toastService.showError(
          `File size exceeds ${maxSizeInMB}MB! Please upload a smaller image.`,
        );

        this.previewUrl = null;
        this.selectedFile = null;

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

  uploadLogo() {
    if (!this.selectedFile) {
      console.log('No file selected!');
      return;
    }

    const formData = new FormData();
    formData.append('logoFile', this.selectedFile, this.selectedFile.name);

    for (const pair of (formData as any).entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    this.branchService.uploadCompanyLogo(formData).subscribe(
      (res: any) => {
        console.log('successfully uploaded logo:', res);

        this.toastService.showSuccess(res.error);
        setTimeout(() => {
          this.logoUpdated.emit();
          this.close.emit(true);
        }, 3000);
      },
      (error) => {
        console.log('error while uploading logo:', error);
      },
    );
  }


  onClose() {
    this.close.emit(true);
  }
}
