import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { DirectivesModule } from 'src/app/core/derective/directives.module';
import { ThemeModule } from 'src/app/theme/theme.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionItemComponent } from './dashboard/transaction-item/transaction-item.component';
import { NftComponent } from './nft/nft.component';
import { ReferralsComponent } from './referrals/referrals.component';
import { SettingsComponent } from './settings/settings.component';
import { ButtonActionComponent } from './settings/button-action/button-action.component';
import { ModalEditComponent } from './settings/modal-edit/modal-edit.component';
import { NftItemComponent } from './nft/nft-item/nft-item.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalGoogleComponent } from './settings/modal-google/modal-google.component';
import { ModalPasswordComponent } from './settings/modal-password/modal-password.component';
import { ModalWalletComponent } from './settings/modal-wallet/modal-wallet.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { CoreModule } from 'src/app/core/core.module';
import { ModalGoogleProblemComponent } from './settings/modal-google-problem/modal-google-problem.component';

@NgModule({
    declarations: [
        MainComponent,
        NftComponent,
        DashboardComponent,
        SettingsComponent,
        ReferralsComponent,
        TransactionItemComponent,
        ButtonActionComponent,
        ModalEditComponent,
        NftItemComponent,
        ModalGoogleComponent,
        ModalPasswordComponent,
        ModalWalletComponent,
        ModalGoogleProblemComponent,
    ],
    imports: [
        CommonModule,
        MainRoutingModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        DirectivesModule,
        ThemeModule,
        OverlayscrollbarsModule,
        NgxPaginationModule,
        MatDatepickerModule,
        MatInputModule,
        MatIconModule,
        MatNativeDateModule,
        MatRippleModule,
        CoreModule,
    ],
})
export class MainModule {}
