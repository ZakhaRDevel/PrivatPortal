import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AnnouncementModel } from '../models/announcement.model';
import { AnnouncementService } from '../services/announcement.service';

@Injectable({
    providedIn: 'root',
})
export class AnnouncementResolver implements Resolve<any> {
    constructor(
        protected router: Router,
        private announcementService: AnnouncementService
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | any {
        if (route.params?.id) {
            return this.announcementService
                .getAnnouncement(route.params.id)
                .pipe(
                    map((data) => data),
                    catchError((error) => {
                        return of(null);
                    })
                );
        } else {
            // return this.announcementService.published().pipe(
            //     map((data) => data),
            //     catchError((error) => {
            //         return of(null);
            //     })
            // );
        }
    }
}
