import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { ProductCategoryModel } from 'src/app/data/models/product-category.model';
import { ProductTypeModel } from 'src/app/data/models/product-type.model';
import { ProductSerieModel } from 'src/app/data/models/product-serie.model';
import { ProductService } from 'src/app/data/services/product.service';

@Component({
    selector: 'app-modal-catalog',
    templateUrl: './modal-catalog.component.html',
    styleUrls: ['./modal-catalog.component.scss'],
    animations: [
        trigger('toggle', [
            state(
                'shown',
                style({
                    height: '*',
                    opacity: '*',
                    overflow: 'hidden',
                    padding: '*',
                    margin: '*',
                })
            ),
            state(
                'hidden',
                style({
                    height: '0',
                    opacity: '0',
                    overflow: 'hidden',
                    padding: '0',
                    margin: '0',
                })
            ),
            transition('hidden <=> shown', animate('0.25s')),
            transition('hidden <=> shown', animate('0.25s')),
        ]),
        trigger('ModalAnimate', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('500ms', style({ opacity: 1 })),
            ]),
        ]),
    ],
})
export class ModalCatalogComponent implements OnInit {
    selectedCategory: ProductCategoryModel;
    selectedType: ProductTypeModel;
    selectedSerie: ProductSerieModel;

    categories: ProductCategoryModel[];

    constructor(
        private matDialogRef: MatDialogRef<ModalCatalogComponent>,
        private productService: ProductService
    ) {
        this.productService.categories().subscribe((res) => {
            this.categories = res;
        });
    }

    ngOnInit(): void {}

    closeModal() {
        this.matDialogRef.close();
    }

    selectCategory(category: ProductCategoryModel) {
        this.selectedType = null;

        if (this.selectedCategory?.slug === category.slug) {
            this.selectedCategory = null;
            return;
        }

        this.selectedCategory = category;
    }

    selectType(type: ProductTypeModel) {
        this.selectedSerie = null;

        if (this.selectedType?.slug === type.slug) {
            this.selectedType = null;
            return;
        }

        this.selectedType = type;

        if (!type?.productSeries?.length) {
            this.filter();
        }
    }

    selectSerie(serie: ProductSerieModel) {
        this.selectedSerie = serie;
        this.filter();
    }

    filter() {
        const filter = {
            productCategory: this.selectedCategory.id,
            productType: this.selectedType.id,
        };

        if (this.selectedSerie) {
            filter['productSerie'] = this.selectedSerie.id;

            if (this.selectedSerie?.productColors?.length) {
                filter['productColor'] = this.selectedSerie.productColors[0].id;
            }
        }

        this.matDialogRef.close(filter);
    }
}
