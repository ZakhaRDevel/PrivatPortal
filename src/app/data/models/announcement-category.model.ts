import { Model } from 'src/app/core/abstract/model';
import { TranslatableModel } from 'src/app/core/abstract/translatable-model';
import { AnnouncementCategoryTranslationModel } from './announcement-category-translation.model';

export class AnnouncementCategoryModel extends TranslatableModel {
    id: number;
    slug: string;
    translations: AnnouncementCategoryTranslationModel[];
    title: string;
    locale: string;
}
