import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root',
})
export class LandingUplinerResolver implements Resolve<UserModel> {
    constructor(
        protected router: Router,
        private userService: UserService,
        private authService: AuthService
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<UserModel> {
        const full = route.data.full;
        let uplineId =
            (full ? route.queryParams.u : route.params.uplineId) || null;

        const initialUpliner = uplineId;

        const lsUplineId = this.userService.upliner || '';

        if (!uplineId) {
            uplineId = null;
            // uplineId = uplineId.toLowerCase().includes('pc') ? +uplineId.toLowerCase().replace('pc', '') : ;
        }

        if (!uplineId && lsUplineId.length) {
            // uplineId = +lsUplineId.toLowerCase().replace('pc', '');
            uplineId = lsUplineId;
        }

        return this.userService.getUpliner(uplineId, full).pipe(
            map((data) => data),
            catchError((error) => {
                return of(null);
            })
        ) as Observable<UserModel>;
    }
}
