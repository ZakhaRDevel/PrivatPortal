import * as moment from 'moment';
import { TranslatableModel } from 'src/app/core/abstract/translatable-model';
import { AnnouncementCategoryModel } from './announcement-category.model';
import { AnnouncementTranslationModel } from './announcement-translation.model';

export class AnnouncementModel extends TranslatableModel {
    id: number;
    slug: string;
    publishedAt: Date;
    announcementCategory: AnnouncementCategoryModel;
    translations: AnnouncementTranslationModel[];
    title: string;
    description: string;
    subject: string;
    locale: string;

    get published(): string {
        return this.publishedAt
            ? moment(this.publishedAt).format('YYYY-MM-DD')
            : '';
    }

    get isNew(): boolean {
        return moment()
            .utc()
            .subtract(36, 'hours')
            .isBefore(moment(this.publishedAt));
    }
}
