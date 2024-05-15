import { Model } from 'src/app/core/abstract/model';

export class AnnouncementCategoryTranslationModel extends Model {
    id: number;
    title: string;
    locale: string;
}
