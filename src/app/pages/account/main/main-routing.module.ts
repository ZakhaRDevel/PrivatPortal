import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageResolver } from 'src/app/data/resolvers/page.resolver';
import { AnnouncementItemComponent } from './announcement/announcement-item/announcement-item.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main.component';
import { NftComponent } from './nft/nft.component';
import { ReferralsComponent } from './referrals/referrals.component';
import { SettingsComponent } from './settings/settings.component';
import { GiveawaysComponent } from './giveaways/giveaways.component';
import { StoreModule } from './store/store.module';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        resolve: {
            page: PageResolver,
        },
        data: {
            slug: 'account-general',
        },

        children: [
            {
                path: '',
                redirectTo: 'dashboard',
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                resolve: {
                    page: PageResolver,
                },
                data: {
                    slug: 'dashboard',
                    additions: ['nft'],
                },
            },
            {
                path: 'referrals',
                component: ReferralsComponent,
                resolve: {
                    page: PageResolver,
                },
                data: {
                    slug: 'referral',
                },
            },
            {
                path: 'settings',
                component: SettingsComponent,
                resolve: {
                    page: PageResolver,
                },
                data: {
                    slug: 'settings',
                    additions: ['errors'],
                },
            },
            {
                path: 'nft',
                component: NftComponent,
                resolve: {
                    page: PageResolver,
                },
                data: {
                    slug: 'nft',
                    additions: ['errors'],
                },
            },
            {
                path: 'nft/:data',
                component: NftComponent,
                resolve: {
                    page: PageResolver,
                },
                data: {
                    slug: 'dashboard',
                    // additions: ['dashboard']
                },
            },
            {
                path: 'announcements',
                loadChildren: () =>
                    import('./announcement/announcement.module').then(
                        (mod) => mod.AnnouncementModule
                    ),
            },
            {
                path: 'activities',
                loadChildren: () =>
                    import('./giveaways/giveaways.module').then(
                        (mod) => mod.GiveawaysModule
                    ),
            },
            {
                path: 'store',
                loadChildren: () =>
                    import('./store/store.module').then(
                        (mod) => mod.StoreModule
                    ),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MainRoutingModule {}
