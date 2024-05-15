import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LanguageListResolver } from './data/resolvers/language.resolver';

const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./pages/pages.module').then((m) => m.PagesModule),
        resolve: {
            languages: LanguageListResolver,
        },
    },
    {
        path: '**',
        redirectTo: '',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            initialNavigation: 'enabled',
            scrollPositionRestoration: 'top',
            anchorScrolling: 'enabled',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
