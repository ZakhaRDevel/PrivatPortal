import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageModel } from 'src/app/data/models/page.models';
import { ProductModel } from 'src/app/data/models/product.model';

@Component({
    selector: 'app-store-product-page',
    templateUrl: './store-product-page.component.html',
    styleUrls: ['./store-product-page.component.scss'],
})
export class StoreProductPageComponent implements OnInit {
    get isMobile(): boolean {
        return innerWidth < 1024 ? true : false;
    }
    isShowAbout: boolean = true;

    openInfo: number = null;

    product: ProductModel;

    page: PageModel;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.product = data.product;
        });
        this.route.parent.data.subscribe((data) => {
            this.page = data.page;
        });
    }

    @HostListener('document:click', ['$event'])
    clickout(event) {
        // if (this.openInfo != null) {
        //     this.openInfo = null;
        // }

        if (this.openInfo != null) {
            const btnInfoMob1 = document.getElementById('btnInfoMob1');
            const btnInfoMob2 = document.getElementById('btnInfoMob2');
            const btn1 = document.getElementById('btn1');
            const btn2 = document.getElementById('btn2');

            if (
                event.target !== btnInfoMob1 &&
                event.target !== btnInfoMob2 &&
                event.target.closest('#btn1') !== btn1 &&
                event.target.closest('#btn2') !== btn2
            ) {
                this.openInfo = null;
            }
        }
    }

    toggleInfo(e) {
        if (this.isMobile) {
            this.openInfo = e;
        }
    }
}
