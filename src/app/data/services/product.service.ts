import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { ModelApiService } from '../../core/abstract/model-api.service';
import { ProductCategoryModel } from '../models/product-category.model';
import { ProductColorModel } from '../models/product-color.model';
import { ProductSerieModel } from '../models/product-serie.model';
import { ProductTypeModel } from '../models/product-type.model';
import { ProductModel } from '../models/product.model';

@Injectable({
    providedIn: 'root',
})
export class ProductService extends ModelApiService {
    categories(): Observable<ProductCategoryModel[]> {
        return this.http.get(`${this.apiMeUrl}/product/categories`).pipe(
            map((data: any) =>
                ProductCategoryModel.fromJsonArray(
                    data.data,
                    this.langService
                ).map((category) => {
                    category.productTypes = ProductTypeModel.fromJsonArray(
                        category.productTypes,
                        this.langService
                    ).map((itm) => {
                        itm.productSeries = ProductSerieModel.fromJsonArray(
                            itm.productSeries,
                            this.langService
                        ).map((serie) => {
                            serie.productColors =
                                ProductColorModel.fromJsonArray(
                                    serie.productColors,
                                    this.langService
                                );
                            return serie;
                        });
                        return itm;
                    });

                    return category;
                })
            )
        );
    }

    list(filters: any): Observable<ProductModel[]> {
        return this.http
            .get(
                `${this.apiMeUrl}/product?${new URLSearchParams(
                    filters
                ).toString()}`
            )
            .pipe(
                map((data: ProductModel[]) => {
                    const item = ProductModel.fromJsonArray(
                        data,
                        this.langService
                    ).map((itm) => {
                        itm.productCategory = ProductCategoryModel.fromJson(
                            itm.productCategory,
                            this.langService
                        );
                        itm.productType = ProductTypeModel.fromJson(
                            itm.productType,
                            this.langService
                        );

                        return itm;
                    });

                    return item;
                })
            );
    }

    item(id: number): Observable<ProductModel> {
        return this.http.get(`${this.apiMeUrl}/product/${id}`).pipe(
            map((item: ProductModel) => {
                const itm = ProductModel.fromJson(item, this.langService);
                itm.productCategory = ProductCategoryModel.fromJson(
                    itm.productCategory,
                    this.langService
                );
                itm.productType = ProductTypeModel.fromJson(
                    itm.productType,
                    this.langService
                );

                return itm;
            })
        );
    }
}
