import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { LandingHeaderComponent } from './landing-header/landing-header.component';
import { LandingFooterComponent } from './landing-footer/landing-footer.component';
import { ScrollUpComponent } from './scroll-up/scroll-up.component';
import { RouterModule } from '@angular/router';
import { NgwWowModule } from 'ngx-wow';
import { CoreModule } from 'src/app/core/core.module';
import { ThemeModule } from 'src/app/theme/theme.module';

@NgModule({
    declarations: [
        LandingComponent,
        LandingHeaderComponent,
        LandingFooterComponent,
        ScrollUpComponent,
    ],
    imports: [
        CommonModule,
        LandingRoutingModule,
        CoreModule,
        RouterModule,
        ThemeModule,
        NgwWowModule,
    ],
})
export class LandingModule {}
