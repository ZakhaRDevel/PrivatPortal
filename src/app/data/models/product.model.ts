import { TranslatableModel } from 'src/app/core/abstract/translatable-model';
import { ProductCategoryModel } from './product-category.model';
import { ProductColorModel } from './product-color.model';
import { ProductSerieModel } from './product-serie.model';
import { ProductTypeModel } from './product-type.model';

export class ProductModel extends TranslatableModel {
    id: number;
    slug: string;
    thumbnail: string;
    order: number;
    price: number;
    translations: any[];
    title: string;
    locale: string;
    productCategory: ProductCategoryModel;
    productType: ProductTypeModel;
    productSerie: ProductSerieModel;
    productColor: ProductColorModel;
}
