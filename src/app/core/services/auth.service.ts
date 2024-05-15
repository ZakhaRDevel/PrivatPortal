import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
import { environment } from '../../../environments/environment';
import { AUTH_EVENT } from '../enums/auth-event';
import { TokenService } from './token.service';
import { UserModel } from 'src/app/data/models/user.model';
import { IHttpResponse } from '../interfaces/http-response.interface';
const Web3 = require('web3');

export interface AuthData {
    token: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    authEvent: BehaviorSubject<any>;

    private readonly api = `${environment.api.url}/auth`;

    currentUser: UserModel;

    authData = {
        login: '',
        password: '',
        locale: '',
    };

    get isSigned(): boolean {
        return !!(this.tokenService.token || false);
    }

    get window(): any {
        return window;
    }

    constructor(
        private tokenService: TokenService,
        private router: Router,
        protected http: HttpClient
    ) {
        this.authEvent = new BehaviorSubject(
            this.isSigned ? AUTH_EVENT.LoggedIn : AUTH_EVENT.LoggedOut
        );

        this.currentUser = new UserModel({} as UserModel);
    }

    signup(params: {
        email: string;
        uplinerId: string;
    }): Observable<IHttpResponse> {
        return this.http.post<IHttpResponse>(`${this.api}/signup`, params);
    }

    resendEmailConfirmation(params: {
        email: string;
        locale: string;
    }): Observable<IHttpResponse> {
        return this.http.post<IHttpResponse>(
            `${this.api}/resendEmailConfirmation`,
            params
        );
    }

    confirmEmail(params: { token: string }): Observable<IHttpResponse> {
        return this.http.post<IHttpResponse>(
            `${this.api}/confirmEmail`,
            params
        );
    }

    login(params: {
        login: string;
        password: string;
        locale: string;
    }): Observable<any> {
        return this.http.post(`${this.api}/login`, params).pipe(
            tap((data: UserModel) => {
                if (data.token) {
                    this.setAuthData(data.token);
                    this.authEvent.next(AUTH_EVENT.LoggedIn);
                }
            })
        );
    }

    loginWallet(params: {
        signature: string;
        type: string;
        locale: string;
    }): Observable<any> {
        return this.http.post(`${this.api}/login/wallet`, params).pipe(
            tap((data: UserModel) => {
                if (data.token) {
                    this.setAuthData(data.token);
                    this.authEvent.next(AUTH_EVENT.LoggedIn);
                }
            })
        );
    }

    recovery(params: { email: string; locale: string }): Observable<any> {
        return this.http.post(`${this.api}/recovery`, params).pipe(
            tap((data: UserModel) => {
                if (data.token) {
                    this.setAuthData(data.token);
                    this.authEvent.next(AUTH_EVENT.LoggedIn);
                }
            })
        );
    }

    confirmRecovery(params: { token: string }): Observable<IHttpResponse> {
        return this.http.post<IHttpResponse>(
            `${this.api}/confirmRrecovery`,
            params
        );
    }

    passwordReset(params: {
        token: string;
        password: string;
    }): Observable<IHttpResponse> {
        return this.http.post<IHttpResponse>(
            `${this.api}/passwordReset`,
            params
        );
    }

    generate2FA(): Observable<any> {
        return this.http.get<any>(`${this.api}/security/generate2fa`);
    }

    verify2FA(params): Observable<any> {
        return this.http.post<any>(`${this.api}/security/verify2fa`, params);
    }

    logout() {
        this.clearAuthData();
        this.authEvent.next(AUTH_EVENT.LoggedOut);
    }

    setAuthData(token: string) {
        this.tokenService.setToken(token);
    }

    clearAuthData(navigate: boolean = true) {
        this.tokenService.clearToken();
        if (navigate) {
            this.router.navigateByUrl('/login').then();
        }
    }

    async createSignature(message: string) {
        if (this.window.web3) {
            this.window.web3 = new Web3(this.window.web3.currentProvider);
        } else {
            window.alert('MetaMask not installed!');
            return;
        }

        return this.window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(async (acc: any) => {
                this.window.web3.eth.defaultAccount = acc[0];

                const signature = await this.window.web3.eth.personal
                    .sign(message, acc[0])
                    .then((signature) => signature);

                return btoa(`${signature}@${acc[0]}@${message}`);
            })
            .catch(() => {
                // this.alertService.open('alert_wallet_rejected');
            });
    }
}
