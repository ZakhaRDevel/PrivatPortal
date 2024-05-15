import {
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ProductCategoryModel } from 'src/app/data/models/product-category.model';
import { ProductColorModel } from 'src/app/data/models/product-color.model';
import { ProductSerieModel } from 'src/app/data/models/product-serie.model';
import { ProductTypeModel } from 'src/app/data/models/product-type.model';
import { ProductModel } from 'src/app/data/models/product.model';
import { ProductService } from 'src/app/data/services/product.service';
import { ModalCatalogComponent } from '../modal-catalog/modal-catalog.component';
import { MatDialog } from '@angular/material/dialog';
import { PageModel } from 'src/app/data/models/page.models';
import { ActivatedRoute } from '@angular/router';
import {
    ScrollToConfigOptions,
    ScrollToService,
} from '@nicky-lenaers/ngx-scroll-to';

@Component({
    selector: 'app-store-page',
    templateUrl: './store-page.component.html',
    styleUrls: ['./store-page.component.scss'],
})
export class StorePageComponent implements OnInit {
    @ViewChild('sliderProduct', { static: false }) sliderProduct: ElementRef;
    @ViewChild('sliderInfo', { static: false }) sliderInfo;
    @ViewChild('sliderBlock', { static: false }) sliderBlock: ElementRef;

    @ViewChild('productsBlock', { static: false }) productsBlock: ElementRef;

    sliderProductConfig: any = {
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        infinite: true,
        // adaptiveHeight: false,
        swipe: true,
        touchMove: true,
        centerMode: true,
        centerPadding: '0',
        variableWidth: true,
        focusOnSelect: true,
        asNavFor: '.sliderInfo',
        accessibility: true,
        dots: true,
        // speed: 0,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    variableWidth: false,
                    // centerMode: true,
                    // variableWidth: true,
                    // focusOnSelect: true
                },
            },
        ],
    };

    sliderInfoConfig: any = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        dots: false,
        infinite: false,
        asNavFor: '.sliderProduct',
    };

    openBtnFilter = '';

    currentFilter = {
        color: '',
    };

    widthSlide: number;

    categories: ProductCategoryModel[] = [];

    selectedCategory: ProductCategoryModel;
    selectedType: ProductTypeModel;
    selectedSerie: ProductSerieModel;
    selectedColor: ProductColorModel;

    products: ProductModel[] = [];

    page: PageModel;

    currentProduct: ProductModel;

    loading: boolean = true;

    get isMobile(): boolean {
        return innerWidth < 1024 ? true : false;
    }

    constructor(
        private _elementRef: ElementRef,
        private productService: ProductService,
        private matDialog: MatDialog,
        private route: ActivatedRoute,
        private scrollToService: ScrollToService
    ) {}

    ngOnInit(): void {
        this.route.parent.data.subscribe((data) => {
            this.page = data.page;
        });

        this.productService.categories().subscribe((res) => {
            this.categories = res;

            const category = this.categories[0];
            const type = category.productTypes[0];
            const serie = type.productSeries.find(
                (itm) => itm.slug === 'classic-men'
            );

            if (!this.route.snapshot.queryParams?.productCategory) {
                this.selectTab(category, type, serie);
            }

            this.route.queryParams.subscribe((params) => {
                if (params?.productCategory) {
                    this.showByFilters(params, true);
                }
            });
        });
    }

    selectTab(
        category: ProductCategoryModel,
        type: ProductTypeModel,
        serie?: ProductSerieModel,
        color?: ProductColorModel
    ) {
        const filter = {
            productCategory: category.id,
            productType: type.id,
        };

        if (type?.productSeries?.length && !serie) {
            return;
        }

        if (serie?.productColors?.length && !color) {
            color = serie.productColors[0];
        }

        this.selectedCategory = category;
        this.selectedType = type;
        this.selectedSerie = serie;
        this.selectedColor = color;

        if (serie) {
            filter['productSerie'] = serie.id;
        }

        if (color) {
            filter['productColor'] = color.id;
        }

        this.showByFilters(filter);
    }

    sliderChange(e, type: string = 'before') {
        if (type === 'after') {
            this.currentProduct = this.products[e.currentSlide];
        }

        let slide = document.querySelectorAll('.slider-item-info');
        let active = document.querySelectorAll('.slick-active');

        slide.forEach((itm) => {
            itm?.classList.remove('slide-middle');
        });

        active[1]?.classList.add('slide-middle');
        active[2]?.classList.add('slide-middle');
        active[3]?.classList.add('slide-middle');

        slide.forEach((itm) => {
            itm?.classList.remove('visible');
            itm?.classList.remove('left');
            itm?.classList.remove('center');
            itm?.classList.remove('right');
        });

        if (this.products.length < 4) {
            // slide.forEach((itm) => {
            //     itm?.classList.remove('inv');
            // });
            switch (e.currentSlide) {
                case 2:
                    slide[4]?.classList.remove('inv');
                    slide[3]?.classList.remove('inv');
                    slide[5]?.classList.remove('inv');
                    slide[2]?.classList.add('inv');
                    break;
                case 1:
                    slide[2]?.classList.remove('inv');
                    slide[4]?.classList.remove('inv');
                    slide[5]?.classList.add('inv');
                    // slide[2]?.classList.remove('inv');
                    // slide[6]?.classList.remove('inv');
                    break;
                case 0:
                    slide[3]?.classList.remove('inv');
                    slide[1]?.classList.remove('inv');
                    slide[2]?.classList.remove('inv');
                    slide[0]?.classList.add('inv');
                    slide[4]?.classList.add('inv');
                    // slide[4]?.classList.add('inv');
                    // slide[3]?.classList.add('inv');
                    // slide[2]?.classList.remove('inv');
                    break;
                default:
            }
        }
    }

    beforeChange(e) {
        const slide = document.querySelectorAll('.slider-item-info');

        if (this.products.length < 4) {
            switch (e.nextSlide) {
                case 2:
                    if (e.currentSlide === 1) {
                        slide[2]?.classList.add('inv');
                        slide[6]?.classList.add('inv');
                        slide[5]?.classList.remove('inv');
                    } else {
                        slide[0]?.classList.remove('inv');
                        slide[2]?.classList.remove('inv');
                        slide[3]?.classList.add('inv');
                        slide[6]?.classList.add('inv');
                    }

                    break;
                case 1:
                    slide[1]?.classList.add('inv');
                    slide[2]?.classList.remove('inv');
                    slide[5]?.classList.add('inv');
                    if (e.currentSlide === 0) {
                        slide[4]?.classList.remove('inv');
                    }
                    break;
                case 0:
                    if (e.currentSlide === 2) {
                        slide[3]?.classList.add('inv');
                        slide[7]?.classList.add('inv');
                        slide[6]?.classList.remove('inv');
                    } else {
                        slide[3]?.classList.remove('inv');
                        slide[1]?.classList.remove('inv');
                        slide[4]?.classList.add('inv');
                        slide[0]?.classList.add('inv');
                    }

                    break;
                default:
            }
        }
    }

    setFilterParam(param) {
        this.openBtnFilter = '';
    }

    openFilter(e) {
        this.openBtnFilter = e;
    }

    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (this.openBtnFilter.length > 0) {
            const btnDropdown0 = document.getElementById('btnDropdown0');
            const btnDropdown1 = document.getElementById('btnDropdown1');
            const btnDropdown2 = document.getElementById('btnDropdown2');

            if (
                event.target !== btnDropdown0 &&
                event.target !== btnDropdown1 &&
                event.target !== btnDropdown2
            ) {
                this.openBtnFilter = '';
            }
        }
    }

    openModalCatalog() {
        const dialog = this.matDialog.open(ModalCatalogComponent);

        dialog.afterClosed().subscribe((data) => {
            if (data) {
                this.showByFilters(data, true);
            }
        });
    }

    showByFilters(filters: any, scroll: boolean = false) {
        if (filters.productCategory) {
            this.selectedCategory = this.categories.find(
                (itm) => itm.id == filters.productCategory
            );
        }

        if (filters.productType) {
            this.selectedType = this.selectedCategory.productTypes.find(
                (itm) => itm.id == filters.productType
            );
        }

        if (filters.productSerie) {
            this.selectedSerie = this.selectedType.productSeries.find(
                (itm) => itm.id == filters.productSerie
            );
        } else {
            this.selectedSerie = null;
        }

        if (filters.productColor) {
            this.selectedColor = this.selectedSerie.productColors.find(
                (itm) => itm.id == filters.productColor
            );
        } else {
            this.selectedColor = null;
        }

        this.loading = true;

        this.productService.list(filters).subscribe((res) => {
            this.products = res;
            this.currentProduct = this.products[0];
            this.sliderProductConfig.slidesToShow = 3;

            setTimeout(() => {
                if (res.length < 4) {
                    this.sliderProductConfig.slidesToShow = 1;
                    setTimeout(() => {
                        let slide: any =
                            document.querySelectorAll('.slider-item');

                        slide[0].classList.add('inv');
                        slide[4].classList.add('inv');
                    }, 10);
                }

                if (window.innerWidth <= 540 && scroll) {
                    setTimeout(() => {
                        const config: ScrollToConfigOptions = {
                            target: 'products',
                            offset: -115,
                            duration: 300,
                        };

                        this.scrollToService.scrollTo(config);
                    }, 1000);
                }

                this.loading = false;
            }, 1000);
        });
    }
}
