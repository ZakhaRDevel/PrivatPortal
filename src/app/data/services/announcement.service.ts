import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { ModelApiService } from '../../core/abstract/model-api.service';
import { AnnouncementCategoryModel } from '../models/announcement-category.model';
import { AnnouncementModel } from '../models/announcement.model';

@Injectable({
    providedIn: 'root',
})
export class AnnouncementService extends ModelApiService {
    searchEvent: EventEmitter<string> = new EventEmitter<string>();
    activeAnnounce: EventEmitter<string> = new EventEmitter<string>();

    announcementChangeEvent: EventEmitter<{ direction: string; slug: string }> =
        new EventEmitter<{ direction: string; slug: string }>();

    lastAnnouncements = {
        lastItem: false,
        firstItem: '',
        current: {} as AnnouncementModel,
        total: 0,
    };

    list(params: any): Observable<any> {
        return this.http
            .get(
                `${this.apiFrontUrl}/announcement/list?take=${
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
                    const items = AnnouncementModel.fromJsonArray(
                        res.data.data,
                        this.langService
                    );

                    const categories = AnnouncementCategoryModel.fromJsonArray(
                        res.categories,
                        this.langService
                    ).map((itm) => {
                        return itm;
                    });

                    return {
                        items,
                        count: res.data.count,
                        categories,
                    };
                })
            );
    }

    getAnnouncement(slug: string) {
        return this.http.get(`${this.apiFrontUrl}/announcement/${slug}`).pipe(
            map((data: any) => {
                const announcement = AnnouncementModel.fromJson(
                    data.announcement,
                    this.langService
                );

                const announcements = AnnouncementModel.fromJsonArray(
                    data.announcements.data,
                    this.langService
                ).map((itm) => {
                    itm.announcementCategory =
                        AnnouncementCategoryModel.fromJson(
                            itm.announcementCategory,
                            this.langService
                        );

                    return itm;
                });

                return {
                    announcement,
                    announcements,
                };
            })
        );
    }
}
