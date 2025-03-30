import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SuccessToastComponent } from './success-toast/success-toast.component';
import { DeleteToastComponent } from './delete-toast/delete-toast.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DpPicPipe } from './pipes/dp-pic.pipe';
import { ProfileComponent } from './Settings/profile/profile.component';
import { SearchPipe } from './pipes/Search/search.pipe';
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
import { OnlyNumberDirective } from './Directives/only-number.directive';
import { OtpComponent } from './otp/otp.component';
import { WarningComponent } from './warning/warning.component';
import { ConfirmBranchDetailsComponent } from './confirm-branch-details/confirm-branch-details.component';
import { ConfirmOtpComponent } from './confirm-otp/confirm-otp.component';
import { WarningPopupComponent } from './warning-popup/warning-popup.component';
import { WarningRoleassigningPopupComponent } from './warning-roleassigning-popup/warning-roleassigning-popup.component';
import { QuoteSuccesspopupComponent } from './quote-successpopup/quote-successpopup.component';
import { QuoteAcceptedpopupComponent } from './quote-acceptedpopup/quote-acceptedpopup.component';
import { UploadSignatureComponent } from './upload-signature/upload-signature.component';
import { WarningQuotecompareMessageComponent } from './warning-quotecompare-message/warning-quotecompare-message.component';
import { WarningPrefixComponent } from './warning-prefix/warning-prefix.component';
import { AmountInWordsPipe } from './pipes/amountInWords/amount-in-words.pipe';
import { ClickoutsideDropdownDirective } from './Directives/clickoutsideDropdown/clickoutside-dropdown.directive';

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
    OnlyNumberDirective,
    OtpComponent,
    WarningComponent,
    ConfirmBranchDetailsComponent,
    ConfirmOtpComponent,
    WarningPopupComponent,
    WarningRoleassigningPopupComponent,
    QuoteSuccesspopupComponent,
    QuoteAcceptedpopupComponent,
    UploadSignatureComponent,
    WarningQuotecompareMessageComponent,
    WarningPrefixComponent,
    AmountInWordsPipe,
    ClickoutsideDropdownDirective,
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
    WarningComponent,
    ConfirmBranchDetailsComponent,
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
    OnlyNumberDirective,
    OtpComponent,
    WarningPopupComponent,
    WarningRoleassigningPopupComponent,
    UploadSignatureComponent,
    WarningPrefixComponent,
    AmountInWordsPipe,
    ClickoutsideDropdownDirective
  ],
})
export class SharedModule {}
