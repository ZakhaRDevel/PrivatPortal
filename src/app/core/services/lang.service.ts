import { EventEmitter, Inject, Injectable } from '@angular/core';
import { LanguageModel } from '../../data/models/language.models';
import { LanguageService } from '../../data/services/language.service';
import { LocalStorageService } from './local-storage.service';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class LangService {
    lang: string;
    langDefault: string;
    langChanged = new EventEmitter();

    private languageService: LanguageService;

    constructor(
        private localStorageService: LocalStorageService,
        @Inject(DOCUMENT) private document: Document,
        private langService: LangService
    ) {
        this.langDefault = 'en';
        this.lang = this.langDefault;
    }

    setLanguageService(languageService: LanguageService) {
        this.languageService = languageService;
    }

    detectLang() {
        this.languageService.getLanguageList().subscribe((languageList) => {
            const langCode: string = !!this.localStorageService.getItem('lang')
                ? this.localStorageService.getItem('lang')
                : window.navigator.language.slice(0, 2);

            const currentLang: LanguageModel = languageList.find(
                (item) => item.code === langCode
            );

            const lang = currentLang ? currentLang.code : this.langDefault;

            this.setLang(lang);
        });
    }

    setLang(lang: string) {
        this.lang = lang;
        this.localStorageService.setItem('lang', this.lang);
        this.langChanged.emit(this.lang);
        this.document.documentElement.lang = this.lang;
    }
}
