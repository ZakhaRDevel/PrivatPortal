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
export class QuestionnareResolver implements Resolve<UserModel> {
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
                const step = route.data.step;

                if (data.userQuestionnaire.isCompleted) {
                    this.router.navigateByUrl('/acc');
                    return data;
                } else if (
                    (!data.userDetail.fullName ||
                        !data.telegram ||
                        // !data.phone ||
                        !data.userDetail.country) &&
                    step > 1
                ) {
                    this.router.navigateByUrl('/acc/form');
                } else if (
                    !data.userQuestionnaire.isInvestor &&
                    !data.userQuestionnaire.isTrader &&
                    !data.userQuestionnaire.isBlogger &&
                    !data.userQuestionnaire.isFreelancer &&
                    !data.userQuestionnaire.isCurrencyExchanger &&
                    !data.userQuestionnaire.isEntrepreneur &&
                    !data.userQuestionnaire.isEmployed &&
                    !data.userQuestionnaire.isOther &&
                    step > 2
                ) {
                    this.router.navigateByUrl('/acc/form/step-two');
                } else if (
                    data.userQuestionnaire.hasMlmExperience === true &&
                    (!data.userQuestionnaire.projectName ||
                        !data.userQuestionnaire.partnersCount) &&
                    step > 3
                ) {
                    this.router.navigateByUrl('/acc/form/step-three');
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
