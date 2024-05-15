import { TranslatableModel } from 'src/app/core/abstract/translatable-model';
import { GiveawayCategoryTranslationModel } from './giveaway-category-translation.model';

export class GiveawayCategoryModel extends TranslatableModel {
    id: number;
    slug: string;
    translations: GiveawayCategoryTranslationModel[];
    title: string;
    locale: string;
}
