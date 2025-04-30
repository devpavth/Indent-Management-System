import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
import { ToastService } from '../../../service/toast/toast.service';
import { BranchService } from '../../../service/Branch/branch.service';
import {
  ImageCroppedEvent,
  LoadedImage,
  ImageTransform,
} from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-upload-companylogo',
  templateUrl: './upload-companylogo.component.html',
  styleUrl: './upload-companylogo.component.css',
})
export class UploadCompanylogoComponent {
  @Output() close = new EventEmitter<boolean>();
  @Output() logoUpdated = new EventEmitter<boolean>();

  @ViewChild('zoomSlider') sliderRef!: ElementRef<HTMLInputElement>;

  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl | null = null;

  showCropper: boolean = false;
  isDragOver: boolean = false;
  showTooltip: boolean = false;

  tooltipTimeout: ReturnType<typeof setTimeout> | null = null;

  croppedBlob: Blob | null = null;

  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  scale: number = 1;
  tooltipLeft: number = 0;
  transform: ImageTransform = {};

  toastService = inject(ToastService);
  branchService = inject(BranchService);

  constructor(private sanitizer: DomSanitizer) {}

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
    const allowedExtensions = ['image/png'];
    const maxSizeInMB = 1;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (!allowedExtensions.includes(file.type)) {
      this.toastService.showError(
        'Invalid file format! Please upload a PNG image.',
      );

      this.showCropper = false;

      this.previewUrl = null;
      this.selectedFile = null;
      return false;
    }

    if (file.size > maxSizeInBytes) {
      this.toastService.showError(
        `File size exceeds ${maxSizeInMB}MB! Please upload a smaller image.`,
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

    // event.blob can be used to upload the cropped image
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

  onZoomChange(slider: HTMLInputElement) {
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };

    this.updateTooltipPosition(slider);
    this.showTooltip = true;

    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }

    this.tooltipTimeout = setTimeout(() => {
      this.showTooltip = false;
    }, 2000);
  }

  updateTooltipPosition(slider: HTMLInputElement) {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const percent = (this.scale - min) / (max - min);
    // slider.style.setProperty('--progress', `${percent}%`);
    const sliderWidth = slider.offsetWidth;
    const thumbOffset = 20;

    this.tooltipLeft = percent * (sliderWidth - thumbOffset) + thumbOffset / 2;
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

  uploadLogo() {
    if (!this.croppedBlob) {
      console.log('No file selected!');
      return;
    }

    const formData = new FormData();
    const croppedFile = new File([this.croppedBlob], 'cropped-logo.png', {
      type: this.croppedBlob.type,
    });

    formData.append('logoFile', croppedFile);

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
