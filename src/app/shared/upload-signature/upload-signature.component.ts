import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeServiceService } from '../../core/components/service/Employee/employee-service.service';
import { ToastService } from '../../core/components/service/toast/toast.service';
import {
  ImageCroppedEvent,
  LoadedImage,
  ImageTransform,
} from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-upload-signature',
  templateUrl: './upload-signature.component.html',
  styleUrl: './upload-signature.component.css',
})
export class UploadSignatureComponent {
  @Input() specialRoleId: number | undefined;
  @Input() isViewUploadSignature!: boolean;
  @Output() close = new EventEmitter<boolean>();

  @ViewChild('zoomSlider') sliderRef!: ElementRef<HTMLInputElement>;

  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl | null = null;
  croppedBlob: Blob | null = null;

  showCropper: boolean = false;
  isDragOver: boolean = false;
  showTooltip: boolean = false;

  scale: number = 1;
  tooltipLeft: number = 0;

  tooltipTimeout: ReturnType<typeof setTimeout> | null = null;

  transform: ImageTransform = {};

  empService = inject(EmployeeServiceService);
  route = inject(Router);
  toastService = inject(ToastService);

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    console.log('specialRoleId:', this.specialRoleId);
  }

  onClose() {
    this.close.emit(true);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      const isValid = this.handleSelectedFile(file);

      if (isValid) {
        this.imageChangedEvent = {
          target: { files: [file] },
        } as unknown as Event;

        this.showCropper = true;
      }
    }
  }

  onFileSelected(event: Event) {
    this.imageChangedEvent = event;
    this.showCropper = true;
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.handleSelectedFile(file);
    }
  }

  handleSelectedFile(file: File) {
    console.log('specialRoleId in file selected:', this.specialRoleId);

    const allowedExtensions = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!allowedExtensions.includes(file.type)) {
      this.toastService.showError(
        'Invalid file format! Please upload a JPG, JPEG, or PNG image.',
      );

      this.showCropper = false;
      this.previewUrl = null;
      this.selectedFile = null;
      return false;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };

    reader.readAsDataURL(this.selectedFile);
    return true;
  }

  imageCropped(event: any) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    this.croppedBlob = event.blob;
  }

  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  decreaseZoom(slider: HTMLInputElement) {
    if (this.scale > 1) {
      this.scale = parseFloat((this.scale - 0.1).toFixed(1));
      this.onZoomChange(slider);
    }
  }

  increaseZoom(slider: HTMLInputElement) {
    if (this.scale < 3) {
      this.scale = parseFloat((this.scale + 0.1).toFixed(1));
      this.onZoomChange(slider);
    }
  }

  onZoomChange(slider: HTMLInputElement) {
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };

    this.updateTooltipPosition(slider);
    this.showTooltip = true;

    if(this.tooltipTimeout){
      clearTimeout(this.tooltipTimeout);
    }

    this.tooltipTimeout = setTimeout(() => {
      this.showTooltip = false;
    }, 2000);
  }

  updateTooltipPosition(slider: HTMLInputElement){
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const percent = (this.scale - min) / (max - min);
    console.log(percent);

    const sliderWidth = slider.offsetWidth;
    console.log(sliderWidth);
    const thumbOffset = 20;

    this.tooltipLeft = percent * (sliderWidth - thumbOffset) + thumbOffset / 2;
    console.log(this.tooltipLeft);
  }

  uploadSignature() {
    console.log('specialRoleId:', this.specialRoleId);
    if (this.specialRoleId === undefined || this.specialRoleId === null) {
      console.error('specialRoleId is required!');
      // alert('Special Role ID is missing.');
      return;
    }

    if (!this.croppedBlob) {
      console.log('No file selected!');
      // alert('Please select a file first.');
      return;
    }
    const formData = new FormData();
    
    const croppedFile = new File([this.croppedBlob], 'cropped-signature.png', {
      type: this.croppedBlob.type,
    })
    formData.append('specialRoleId', this.specialRoleId.toString());
    formData.append('signature', croppedFile);

    for (const pair of (formData as any).entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    this.empService.uploadSignature(formData).subscribe(
      (res: any) => {
        console.log('successfully uploaded signature:', res);
        // this.close.emit(true);

        this.toastService.showSuccess(res.errorMessege);
        setTimeout(() => {
          this.close.emit(true);
          if (this.isViewUploadSignature) {
            this.route.navigate(['/home/updateSign']);
          }
        }, 3000);
      },
      (error) => {
        console.log('error while uploading signature:', error);
      },
    );
  }
}
