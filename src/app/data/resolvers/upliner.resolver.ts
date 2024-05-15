import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root',
})
export class UplinerResolver implements Resolve<UserModel> {
    constructor(protected router: Router, private userService: UserService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<UserModel> {
        const full = route.data.full;
        let uplineId =
            (full ? route.queryParams.u : route.params.uplineId) || null;

        const lsUplineId = this.userService.upliner || '';

        if (uplineId) {
            uplineId = +uplineId.toLowerCase().replace('pc', '');
        } else if (full && lsUplineId.length) {
            uplineId = +lsUplineId
                .toLowerCase()
                .replace('pc', '')
                .replace('PC', '');
        } else {
            uplineId = null;
        }

        return this.userService.getUpliner(uplineId, full).pipe(
            map((data) => data),
            catchError((error) => {
                return of(null);
            })
        ) as Observable<UserModel>;
    }
}
