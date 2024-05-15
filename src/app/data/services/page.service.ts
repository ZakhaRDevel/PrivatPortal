import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { isArrayLike } from 'rxjs/internal/util/isArrayLike';
import { ModelApiService } from '../../core/abstract/model-api.service';
import { PageModel } from '../models/page.models';

@Injectable({
    providedIn: 'root',
})
export class PageService extends ModelApiService {
    getPage(slug: string, additions: string[] = []): Observable<PageModel> {
        return this.http
            .get(
                `${this.apiFrontUrl}/page/${slug}${
                    additions.length ? `?additions=${additions.join(',')}` : ''
                }`
            )
            .pipe(
                map((response: PageModel) => {
                    const page = PageModel.fromJson(response, this.langService);

                    for (const addition of additions) {
                        page[addition] = PageModel.fromJson(
                            page[addition],
                            this.langService
                        );
                    }

                    return page;
                })
            );
    }
}
