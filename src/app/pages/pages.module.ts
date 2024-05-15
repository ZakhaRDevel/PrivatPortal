import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../theme/theme.module';
import { RouterModule, ROUTES } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import { MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { CoreModule } from '../core/core.module';
import { NgwWowModule } from 'ngx-wow';
import { DirectivesModule } from '../core/derective/directives.module';
// import {SlickCarouselModule} from "ngx-slick-carousel";

@NgModule({
    declarations: [PagesComponent],
    imports: [
        CommonModule,
        CoreModule,
        PagesRoutingModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        ThemeModule,
        NgSelectModule,
        MatDialogModule,
        NgwWowModule,
        DirectivesModule,
        // SlickCarouselModule
    ],
    providers: [],
})
export class PagesModule {}
