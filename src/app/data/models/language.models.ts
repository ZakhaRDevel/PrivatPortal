import { Model } from '../../core/abstract/model';

export class LanguageModel extends Model {
    id: number;
    code: string;
    title: string;
    logo: string;

    get image(): string {
        return `assets/img/icons/flags/${this.code}.svg`;
    }
}
