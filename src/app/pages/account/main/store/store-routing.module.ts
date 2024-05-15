import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StoreComponent } from './store.component';
import { StorePageComponent } from './store-page/store-page.component';
import { StoreProductPageComponent } from './store-product-page/store-product-page.component';
import { ProductResolver } from 'src/app/data/resolvers/product.resolver';
import { PageResolver } from 'src/app/data/resolvers/page.resolver';

const routes: Routes = [
    {
        path: '',
        component: StoreComponent,
        resolve: {
            page: PageResolver,
        },
        data: {
            slug: 'store',
        },
        children: [
            {
                path: '',
                component: StorePageComponent,
            },
            {
                path: ':id',
                component: StoreProductPageComponent,
                resolve: {
                    product: ProductResolver,
                },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StoreRoutingModule {}
