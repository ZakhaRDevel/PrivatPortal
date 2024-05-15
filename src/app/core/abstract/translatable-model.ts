import { LangService } from '../services/lang.service';
import { Model } from './model';

export class TranslatableModel extends Model {
    _lang: string;
    translations: any;
    translation: any;
    defaultLang: string = 'en';
    locale: string = 'en';

    constructor(data?: any, langService?: LangService) {
        super(data);

        if (langService) {
            this.setLang(langService.lang);
            langService.langChanged.subscribe((lang) => {
                this.setLang(lang);
            });
        }
    }

    static fromJson(data: any, langService?: LangService): any {
        const model: any = new this(data, langService);

        return model;
    }

    static fromJsonArray(data: any[], langService?: LangService): any[] {
        const models = [];

        if (data.length) {
            data.forEach((item) => {
                models.push(this.fromJson(item, langService));
            });
        }

        return models;
    }

    setLang(lang: string) {
        if (this._lang === lang) {
            return;
        }

        if (this.translations) {
            let translation = this.translations.find(
                (itm) => itm.locale === lang
            );

            if (translation) {
                Object.keys(translation).forEach((key) => {
                    if (key !== 'id') {
                        if (key === 'data') {
                            this[key] =
                                JSON.parse(translation[key]) || this[key];
                        } else if (key === 'meta') {
                        } else {
                            this[key] = translation[key] || this[key];
                        }
                    }
                });

                this._lang = lang;
            } else {
                translation = this.translations.find(
                    (itm) => itm.locale === 'en'
                );
                if (translation) {
                    Object.keys(translation).forEach((key) => {
                        if (key !== 'id') {
                            if (key === 'data') {
                                this[key] =
                                    JSON.parse(translation[key]) || this[key];
                            } else if (key === 'meta') {
                            } else {
                                this[key] = translation[key] || this[key];
                            }
                        }
                    });

                    this._lang = lang;
                }
            }
        }
    }
}
