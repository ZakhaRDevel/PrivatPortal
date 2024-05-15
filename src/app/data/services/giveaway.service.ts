import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { ModelApiService } from '../../core/abstract/model-api.service';
import { GiveawayCategoryModel } from '../models/giveaway-category.model';
import { GiveawayModel } from '../models/giveaway.model';

@Injectable({
    providedIn: 'root',
})
export class GiveawayService extends ModelApiService {
    searchEvent: EventEmitter<string> = new EventEmitter<string>();

    index(): Observable<any> {
        return this.http.get(`${this.apiMeUrl}/giveaway`).pipe(
            map((data: any) => {
                const giveaways = GiveawayModel.fromJsonArray(
                    data.giveaways,
                    this.langService
                ).map((itm) => {
                    itm.prepareData();
                    return itm;
                });

                return {
                    giveaways,
                    statistic: data.statistic,
                };
            })
        );
    }

    create(params: {}): Observable<any> {
        return this.http.post(`${this.apiMeUrl}/giveaway`, params);
    }

    withdraw(params: {}): Observable<any> {
        return this.http.post(`${this.apiMeUrl}/giveaway/withdrawal`, params);
    }

    verifyTelegram(params: {}): Observable<any> {
        return this.http.post(`${this.apiMeUrl}/giveaway/telegram`, params);
    }

    list(params: any): Observable<any> {
        return this.http
            .get(
                `${this.apiMeUrl}/giveaway/list?take=${
                    params.take
                }&order=${JSON.stringify(params.order)}&skip=${
                    params.skip
                }&page=1&limit=10&filter=${JSON.stringify(params.filter)}${
                    params?.categoreies
                        ? `&categoreies=${params?.categoreies}`
                        : ''
                }`
            )
            .pipe(
                map((res: any) => {
                    const data = GiveawayModel.fromJsonArray(
                        res.data.data,
                        this.langService
                    ).map((itm) => {
                        itm.prepareData();
                        return itm;
                    });

                    const categories = GiveawayCategoryModel.fromJsonArray(
                        res.categories,
                        this.langService
                    ).map((itm) => {
                        return itm;
                    });

                    return {
                        data: {
                            items: data,
                            count: res.data.count,
                        },

                        categories,
                    };
                })
            );
    }
}
