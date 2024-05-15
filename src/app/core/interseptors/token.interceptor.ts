import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { TokenService } from '../services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private tokenService: TokenService,
        private authService: AuthService
    ) {}

    private addToken(httpRequest: HttpRequest<any>, token: string) {
        return httpRequest.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (
            this.tokenService.token &&
            request.url.includes(`${environment.api.url}`)
        ) {
            request = this.addToken(request, this.tokenService.token);
        }

        return next.handle(request).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse) {
                    if (
                        (error.status === 401 || error.status === 403) &&
                        !error?.url?.includes('api/me/user') &&
                        !error?.url?.includes('api/auth/login')
                    ) {
                        this.authService.logout();
                    }
                }
                return throwError(() => {
                    return error;
                });
            })
        );
    }
}
