import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingUplinerResolver } from 'src/app/data/resolvers/landing-upliner.resolver';
import { PageResolver } from 'src/app/data/resolvers/page.resolver';
import { UplinerResolver } from 'src/app/data/resolvers/upliner.resolver';
import { UserFrontResolver } from 'src/app/data/resolvers/user-front.resolver';
import { LandingComponent } from './landing.component';

const routes: Routes = [
    {
        path: '',
        component: LandingComponent,
        data: {
            slug: 'home',
        },
        resolve: {
            upliner: LandingUplinerResolver,
            // user: UserFrontResolver,
            page: PageResolver,
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LandingRoutingModule {}
