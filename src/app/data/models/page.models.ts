import { TranslatableModel } from 'src/app/core/abstract/translatable-model';

export class PageModel extends TranslatableModel {
    id: number;
    title: string;
    slug: string;
    data: any;
    meta_data: any;
}
