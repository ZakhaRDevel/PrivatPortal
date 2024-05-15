import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { SmsComponent } from './sms/sms.component';
import { TwoFaComponent } from './two-fa/two-fa.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { CoreModule } from '../../core/core.module';
import { ThemeModule } from '../../theme/theme.module';
import { AuthRoutingModule } from './auth-routing.module';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalformstatusComponent } from './modal-form-status/modal-form-status.component';
import { ModalWalletConnectComponent } from './modal-wallet-connect/modal-wallet-connect.component';
import { RecoveryStepTwoComponent } from './recovery-step-two/recovery-step-two.component';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { DirectivesModule } from 'src/app/core/derective/directives.module';

@NgModule({
    declarations: [
        AuthComponent,
        RegistrationComponent,
        LoginComponent,
        SmsComponent,
        TwoFaComponent,
        RecoveryComponent,
        ModalformstatusComponent,
        ModalWalletConnectComponent,
        RecoveryStepTwoComponent,
        AuthModalComponent,
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        ThemeModule,
        CoreModule,
        // ScrollToModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        DirectivesModule,
    ],
    exports: [],
})
export class AuthModule {}
