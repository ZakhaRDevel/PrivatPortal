import { TranslatableModel } from 'src/app/core/abstract/translatable-model';
import { ProductTypeModel } from './product-type.model';

export class ProductCategoryModel extends TranslatableModel {
    id: number;
    slug: string;
    translations: any[];
    title: string;
    titleSingle: string;
    locale: string;
    productTypes: ProductTypeModel[];
}
