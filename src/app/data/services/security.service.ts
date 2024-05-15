import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ModelApiService } from 'src/app/core/abstract/model-api.service';
import { IHttpResponse } from 'src/app/core/interfaces/http-response.interface';

@Injectable({
    providedIn: 'root',
})
export class SecurityService extends ModelApiService {
    getPhoneCode(params: { locale: string }): Observable<IHttpResponse> {
        return this.http.post<IHttpResponse>(
            `${this.apiMeUrl}/user/security/phoneCode`,
            params
        );
    }

    getTelegramCode(params: { locale: string }): Observable<IHttpResponse> {
        return this.http.post<IHttpResponse>(
            `${this.apiMeUrl}/user/security/telegramCode`,
            params
        );
    }

    verifyCode(params: {
        phoneCode: string;
        telegramCode: string;
    }): Observable<IHttpResponse> {
        return this.http.post<IHttpResponse>(
            `${this.apiMeUrl}/user/security/verify`,
            params
        );
    }
}
