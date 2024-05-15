import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageResolver } from 'src/app/data/resolvers/page.resolver';
import { GiveawaysHistoryPageComponent } from './giveaways-history-page/giveaways-history-page.component';
import { GiveawaysComponent } from './giveaways.component';
import { GiveawaysPageComponent } from './giveaways-page/giveaways-page.component';

const routes: Routes = [
    {
        path: '',
        component: GiveawaysComponent,
        children: [
            {
                path: '',
                component: GiveawaysPageComponent,
                resolve: {
                    page: PageResolver,
                },
                data: {
                    slug: 'giveaways',
                    additions: ['errors', 'giveawayItem'],
                },
            },
            {
                path: 'history',
                component: GiveawaysHistoryPageComponent,
                resolve: {
                    page: PageResolver,
                },
                data: {
                    slug: 'giveawayArchive',
                    additions: ['giveawayItem'],
                },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GiveawaysRoutingModule {}
