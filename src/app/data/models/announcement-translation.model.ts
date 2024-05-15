import { Model } from 'src/app/core/abstract/model';

export class AnnouncementTranslationModel extends Model {
    id: number;
    title: string;
    description: string;
    subject: string;
    locale: string;
}
