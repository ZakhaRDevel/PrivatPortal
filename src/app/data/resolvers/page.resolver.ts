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

@Injectable({
    providedIn: 'root',
})
export class PageResolver implements Resolve<PageModel> {
    constructor(protected router: Router, private pageService: PageService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<PageModel> | PageModel {
        const slug: string = route.data.slug || null;
        const additions: string[] = route.data.additions
            ? route.data.additions
            : [];

        if (slug) {
            return this.pageService.getPage(slug, additions).pipe(
                map((page) => page),
                catchError((error) => {
                    return of(null);
                })
            ) as Observable<PageModel>;
        } else {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then();
            return null;
        }
    }
}
