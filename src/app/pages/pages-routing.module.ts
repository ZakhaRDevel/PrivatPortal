import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { UserGuard } from '../core/guards/user.guard';
import { PagesComponent } from './pages.component';

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        data: {
            slug: 'general',
        },
        children: [
            {
                path: 'acc',
                loadChildren: () =>
                    import('./account/account.module').then(
                        (mod) => mod.AccountModule
                    ),
                data: {
                    slug: 'acc',
                },
                canActivate: [AuthGuard],
            },
            {
                path: '',
                pathMatch: 'full',
                loadChildren: () =>
                    import('./landing/landing.module').then(
                        (mod) => mod.LandingModule
                    ),
            },
            {
                path: '',
                loadChildren: () =>
                    import('./auth/auth.module').then((mod) => mod.AuthModule),
                data: {
                    slug: 'auth',
                },
                canActivate: [UserGuard],
            },
            {
                path: ':uplineId',
                loadChildren: () =>
                    import('./landing/landing.module').then(
                        (mod) => mod.LandingModule
                    ),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
