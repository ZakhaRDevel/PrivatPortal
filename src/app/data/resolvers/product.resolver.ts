import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProductService } from '../services/product.service';

@Injectable({
    providedIn: 'root',
})
export class ProductResolver implements Resolve<any> {
    constructor(
        protected router: Router,
        private productService: ProductService
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | any {
        if (route.params?.id) {
            return this.productService
                .item(+route.params.id.toString().substring(3))
                .pipe(
                    map((data) => data),
                    catchError((error) => {
                        return of(null);
                    })
                );
        }
    }
}
