import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LangService } from '../../core/services/lang.service';
import { ModelApiService } from '../../core/abstract/model-api.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { LanguageModel } from '../models/language.models';

@Injectable({
    providedIn: 'root',
})
export class LanguageService extends ModelApiService {
    languageList: LanguageModel[];
    locale: string = 'en';

    constructor(
        protected http: HttpClient,
        protected langService: LangService,
        protected ls: LocalStorageService
    ) {
        super(http, langService);
        this.langService.setLanguageService(this);
    }

    getLanguageList(): Observable<any> {
        if (this.languageList) {
            return of(this.languageList);
        }

        return this.http.get(`${this.apiFrontUrl}/language`).pipe(
            map((response: any) => {
                this.languageList = LanguageModel.fromJsonArray(response);

                return this.languageList;
            })
        );
    }
}
