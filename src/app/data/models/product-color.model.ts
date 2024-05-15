import { TranslatableModel } from 'src/app/core/abstract/translatable-model';

export class ProductColorModel extends TranslatableModel {
    id: number;
    slug: string;
    translations: any[];
    title: string;
    locale: string;

    get code() {
        return this.slug.includes('white') ? 'white' : 'dark';
    }
}
