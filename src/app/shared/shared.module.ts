import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SuccessToastComponent } from './success-toast/success-toast.component';
import { DeleteToastComponent } from './delete-toast/delete-toast.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DpPicPipe } from './pipe/dp-pic.pipe';
import { ProfileComponent } from './Settings/profile/profile.component';
import { SearchPipe } from './pipe/Search/search.pipe';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { FirstCapLetterDirective } from './Directives/first-cap-letter.directive';
import { SuccessPopComponent } from './success-pop/success-pop.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SpinnerComponent } from './spinner/spinner.component';

import { NetworkErrorComponent } from './network-error/network-error.component';
import { CdeletePopComponent } from './cdelete-pop/cdelete-pop.component';
import { PdfUploadComponent } from './pdf-upload/pdf-upload.component';
import { DeleteComponent } from './delete/delete.component';
import { SuccessComponent } from './success/success.component';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';

@NgModule({
  declarations: [
    SuccessToastComponent,
    DeleteToastComponent,
    DpPicPipe,
    ProfileComponent,
    SearchPipe,
    UnauthorizedComponent,
    FirstCapLetterDirective,
    SuccessPopComponent,
    PageNotFoundComponent,
    SpinnerComponent,

    NetworkErrorComponent,
    CdeletePopComponent,
    PdfUploadComponent,
    DeleteComponent,
    SuccessComponent,
    AutoCompleteComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    SuccessToastComponent,
    DeleteToastComponent,
    FormsModule,
    ReactiveFormsModule,
    DpPicPipe,
    SearchPipe,
    UnauthorizedComponent,
    FirstCapLetterDirective,
    SuccessPopComponent,
    PageNotFoundComponent,
    SpinnerComponent,

    CdeletePopComponent,
    PdfUploadComponent,
    DeleteComponent,
    SuccessComponent,
    AutoCompleteComponent,
  ],
})
export class SharedModule {}
