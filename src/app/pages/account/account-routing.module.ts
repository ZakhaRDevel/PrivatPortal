import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeResolver } from 'src/app/data/resolvers/me.resolver';
import { AccountComponent } from './account.component';

const routes: Routes = [
    {
        path: '',
        component: AccountComponent,

        children: [
            {
                path: '',
                resolve: {
                    me: MeResolver,
                },
                loadChildren: () =>
                    import('./main/main.module').then((mod) => mod.MainModule),
            },
            {
                path: 'form',
                loadChildren: () =>
                    import('./questionnare/questionnare.module').then(
                        (mod) => mod.QuestionnareModule
                    ),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountRoutingModule {}
