import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PageModel } from '../models/page.models';
import { PageService } from '../services/page.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthAdminResolver implements Resolve<any> {
    constructor(protected router: Router, private auth: AuthService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<PageModel> | PageModel {
        const token: string = route.queryParams.token || null;

        if (token) {
            this.auth.setAuthData(token);
            this.router.navigateByUrl('acc');
        } else {
            return null;
        }
    }
}
