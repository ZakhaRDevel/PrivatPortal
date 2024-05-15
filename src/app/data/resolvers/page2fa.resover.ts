import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class Page2faResolver implements Resolve<Page2faResolver> {
    constructor(protected router: Router, private authService: AuthService) {}

    resolve(): Observable<Page2faResolver> {
        if (!this.authService.authData.login) {
            this.router.navigateByUrl('login');
            return of(null);
        }
    }
}
