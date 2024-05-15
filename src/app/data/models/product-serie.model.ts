import { TranslatableModel } from 'src/app/core/abstract/translatable-model';
import { ProductColorModel } from './product-color.model';

export class ProductSerieModel extends TranslatableModel {
    id: number;
    slug: string;
    translations: any[];
    title: string;
    locale: string;
    productColors: ProductColorModel[];
}
