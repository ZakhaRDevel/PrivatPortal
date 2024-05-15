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
export class MeResolver implements Resolve<UserModel> {
    constructor(
        protected router: Router,
        private userService: UserService,
        private authService: AuthService
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<UserModel> {
        return this.userService.me().pipe(
            map((data) => {
                if (
                    !data.userQuestionnaire.isCompleted &&
                    !route.data.isQuestionnare
                ) {
                    this.router.navigateByUrl('/acc/form');
                }
                return data;
            }),
            catchError((error) => {
                this.authService.clearAuthData();
                return of(null);
            })
        ) as Observable<UserModel>;
    }
}
