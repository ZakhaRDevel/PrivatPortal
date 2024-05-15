import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { TwoFaComponent } from './two-fa/two-fa.component';
import { SmsComponent } from './sms/sms.component';
import { RecoveryStepTwoComponent } from './recovery-step-two/recovery-step-two.component';
import { UplinerResolver } from 'src/app/data/resolvers/upliner.resolver';
import { PageResolver } from 'src/app/data/resolvers/page.resolver';
import { Page2faResolver } from 'src/app/data/resolvers/page2fa.resover';
import { AuthAdminResolver } from 'src/app/data/resolvers/auth-admin.resolver';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: 'login',
                pathMatch: 'full',
                component: LoginComponent,
                data: {
                    slug: 'login',
                    additions: ['errors'],
                },
                resolve: {
                    page: PageResolver,
                    authAdmin: AuthAdminResolver,
                },
            },
            {
                path: 'register',
                pathMatch: 'full',
                component: RegistrationComponent,
                data: {
                    slug: 'register',
                    uplineType: 2,
                    additions: ['errors'],
                    full: true,
                },
                resolve: {
                    upliner: UplinerResolver,
                    page: PageResolver,
                },
            },
            {
                path: 'reset-password',
                pathMatch: 'full',
                component: RecoveryComponent,
                data: {
                    slug: 'reset-password',
                    additions: ['errors'],
                },
                resolve: {
                    page: PageResolver,
                },
            },
            {
                path: 'reset-password-step-two',
                pathMatch: 'full',
                component: RecoveryStepTwoComponent,
                data: {
                    slug: 'reset-password-step-two',
                    additions: ['errors'],
                },
                resolve: {
                    page: PageResolver,
                },
            },
            {
                path: '2fa',
                component: TwoFaComponent,
                data: {
                    slug: '2fa',
                    additions: ['errors'],
                },
                resolve: {
                    page: PageResolver,
                    check: Page2faResolver,
                },
            },
            {
                path: 'sms-auth',
                component: SmsComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
