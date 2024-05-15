import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './blocks/header/header.component';
import { FooterComponent } from './blocks/footer/footer.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { LangSwitcherComponent } from './elements/lang-switcher/lang-switcher.component';
import { DirectivesModule } from '../core/derective/directives.module';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { FormPromptComponent } from './elements/form-prompt/form-prompt.component';
import { BtnCopyComponent } from './elements/btn-copy/btn-copy.component';
import { ClipboardModule } from 'ngx-clipboard';
import { NavbarComponent } from './blocks/navbar/navbar.component';
import { SidebarComponent } from './blocks/sidebar/sidebar.component';
import { RefLinkComponent } from './blocks/header/ref-link/ref-link.component';
import { InputPhoneComponent } from './components/input-phone/input-phone.component';
import { InputComponent } from './components/input/input.component';
import { InputSelectTypedComponent } from './components/input-select-typed/input-select-typed.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ModalTransactionDetailsComponent } from './modals/modal-transaction-details/modal-transaction-details.component';
import { InputPincodeComponent } from './elements/input-pincode/input-pincode.component';
import { ModalTabDetailsComponent } from './modals/modal-tab-details/modal-tab-details.component';
import { ModalNftTransferComponent } from './modals/modal-nft-transfer/modal-nft-transfer.component';
import { ModalWindowComponent } from './modals/modal-window/modal-window.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { DatePickerHeaderComponent } from './components/date-picker/date-picker-header/date-picker-header.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { CodeInputComponent } from './components/code-input/code-input.component';
import { ModalBannerComponent } from './modals/modal-banner/modal-banner.component';
import { FastStartComponent } from './blocks/fast-start/fast-start.component';
import { TransactionsComponent } from './blocks/transactions/transactions.component';
import { BtnLoaderComponent } from './components/btn-loader/btn-loader.component';

@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        LangSwitcherComponent,
        FormPromptComponent,
        BtnCopyComponent,
        NavbarComponent,
        SidebarComponent,
        RefLinkComponent,
        InputPhoneComponent,
        InputComponent,
        InputSelectTypedComponent,
        LoaderComponent,
        ModalTransactionDetailsComponent,
        InputPincodeComponent,
        ModalTabDetailsComponent,
        ModalNftTransferComponent,
        ModalWindowComponent,
        DatePickerComponent,
        DatePickerHeaderComponent,
        CodeInputComponent,
        ModalBannerComponent,
        FastStartComponent,
        TransactionsComponent,
        BtnLoaderComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        CoreModule,
        DirectivesModule,
        OverlayscrollbarsModule,
        ClipboardModule,
        DirectivesModule,
        MatDatepickerModule,
        MatInputModule,
        MatIconModule,
        MatNativeDateModule,
        MatRippleModule,
    ],
    exports: [
        HeaderComponent,
        FooterComponent,
        LangSwitcherComponent,
        FormPromptComponent,
        BtnCopyComponent,
        NavbarComponent,
        SidebarComponent,
        RefLinkComponent,
        InputPhoneComponent,
        InputComponent,
        InputSelectTypedComponent,
        LoaderComponent,
        ModalTransactionDetailsComponent,
        ModalWindowComponent,
        InputPincodeComponent,
        DatePickerComponent,
        CodeInputComponent,
        FastStartComponent,
        TransactionsComponent,
        ModalBannerComponent,
        BtnLoaderComponent,
    ],
})
export class ThemeModule {}
