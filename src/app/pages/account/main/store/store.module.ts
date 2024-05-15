import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorePageComponent } from './store-page/store-page.component';
import { StoreProductPageComponent } from './store-product-page/store-product-page.component';
import { StoreRoutingModule } from './store-routing.module';
import { ThemeModule } from '../../../../theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from '../../../../core/derective/directives.module';
import { CoreModule } from '../../../../core/core.module';
import { StoreComponent } from './store.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { BlockMobileFilterComponent } from './block-mobile-filter/block-mobile-filter.component';
import { ModalCatalogComponent } from './modal-catalog/modal-catalog.component';
// import {SlickCarouselModule} from "ngx-slick-carousel";
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

@NgModule({
    declarations: [
        StoreComponent,
        StorePageComponent,
        StoreProductPageComponent,
        BlockMobileFilterComponent,
        ModalCatalogComponent,
    ],
    imports: [
        CommonModule,
        StoreRoutingModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        DirectivesModule,
        ThemeModule,
        CoreModule,
        SlickCarouselModule,
        ScrollToModule.forRoot(),
    ],
})
export class StoreModule {}
