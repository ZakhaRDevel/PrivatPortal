import { TranslatableModel } from 'src/app/core/abstract/translatable-model';
import { ProductSerieModel } from './product-serie.model';

export class ProductTypeModel extends TranslatableModel {
    id: number;
    slug: string;
    translations: any[];
    title: string;
    titleSingle: string;
    locale: string;
    productSeries: ProductSerieModel[];
}
