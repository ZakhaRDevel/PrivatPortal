import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { ModelApiService } from 'src/app/core/abstract/model-api.service';
import { IHttpResponse } from 'src/app/core/interfaces/http-response.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { LangService } from 'src/app/core/services/lang.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { CountryModel } from '../models/country.model';
import { TransactionDataModel } from '../models/transaction-data.model';
import { TransactionStatusModel } from '../models/transaction-status.model';
import { TransactionTypeModel } from '../models/transaction-type.model';
import { TransactionModel } from '../models/transaction.model';
import { UserDetailModel } from '../models/user-detail.model';
import { UserSecurityModel } from '../models/user-security.model';
import { UserWalletModel } from '../models/user-wallet.model';
import { UserModel } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class UserService extends ModelApiService {
    constructor(
        protected http: HttpClient,
        protected langService: LangService,
        private ls: LocalStorageService,
        private authService: AuthService
    ) {
        super(http, langService);
    }

    me(): Observable<UserModel> {
        return this.http.get(`${this.apiMeUrl}/user`).pipe(
            map((data: UserModel) => {
                const user = UserModel.fromJson(data);
                user.userDetail = UserDetailModel.fromJson(user.userDetail);
                user.userDetail.country = CountryModel.fromJson(
                    user.userDetail.country
                );
                user.userSecurity = UserSecurityModel.fromJson(
                    user.userSecurity
                );
                user.userQuestionnaire = user.userQuestionnaire;
                user.userWallets = user.userWallets
                    ? UserWalletModel.fromJsonArray(user.userWallets)
                    : [];

                user.userUpliner = UserModel.fromJson(user.userUpliner);
                this.authService.currentUser = user;
                return user;
            })
        );
    }

    update(data: {}): Observable<UserModel> {
        return this.http
            .put(`${this.apiMeUrl}/user`, data)
            .pipe(map((data: UserModel) => UserModel.fromJson(data)));
    }

    deleteWallet(data: {}): Observable<any> {
        return this.http.post(`${this.apiMeUrl}/user/wallet/delete`, data);
    }

    walletCheck(params: {}): Observable<any> {
        return this.http.post<any>(
            `${this.apiMeUrl}/user/wallet/check`,
            params
        );
    }

    confirmSecurity(params: {
        phoneCode: string;
        smsCode: string;
    }): Observable<IHttpResponse> {
        return this.http.post<IHttpResponse>(
            `${this.apiMeUrl}/confirmSecurity`,
            params
        );
    }

    getTelegramCode(isCheck = false): Observable<string> {
        return this.http.get<string>(
            `${this.apiMeUrl}/user/security/telegramCode${
                isCheck ? '?isCheck=true' : ''
            }`
        );
    }

    getUpliner(uplineId: number, full?: boolean): Observable<UserModel> {
        return this.http
            .get(
                `${this.apiFrontUrl}/user/${uplineId}${
                    full ? '?full=true' : ''
                }`
            )
            .pipe(
                map((data: UserModel) => {
                    const user = UserModel.fromJson(data);

                    if (user.uplineId && !this.authService.isSigned) {
                        this.setUpliner(user.uplineId);
                        const increment = this.setClicks(user.uplineId);

                        if (increment) {
                            this.incrementClicks(user.uplineId).subscribe();
                        }
                    }
                    return user;
                })
            );
    }

    incrementClicks(uplineId: number): Observable<any> {
        return this.http.post(
            `${this.apiFrontUrl}/user/${uplineId}/increment`,
            {}
        );
    }

    home(): Observable<any> {
        return this.http.get(`${this.apiMeUrl}/user/dashboard`).pipe(
            map((data: any) => {
                console.log(data);
                data.transactions = TransactionModel.fromJsonArray(
                    data.transactions
                ).map((itm) => {
                    itm.transactionType = TransactionTypeModel.fromJson(
                        itm.transactionType,
                        this.langService
                    );
                    itm.transactionStatus = TransactionStatusModel.fromJson(
                        itm.transactionStatus,
                        this.langService
                    );
                    itm.data = new TransactionDataModel(
                        itm.data,
                        itm.transactionType.id
                    );

                    return itm;
                });
                return data;
            })
        );
    }

    affiliateTotal(): Observable<any> {
        return this.http.get(`${this.apiMeUrl}/user/affiliate/total`).pipe(
            map((data: any) => {
                return data;
            })
        );
    }

    affiliatePartners(params: any): Observable<any> {
        return this.http
            .get(
                `${this.apiMeUrl}/user/affiliate/partners?take=${
                    params.take
                }&order=${JSON.stringify(params.order)}&skip=${
                    params.skip
                }&page=1&limit=10&filter=${JSON.stringify(params.filter)}`
            )
            .pipe(
                map((res: any) => {
                    const items = UserModel.fromJsonArray(res.data);

                    return {
                        items,
                        count: res.count,
                    };
                })
            );
    }

    passwordCheck(params: {}): Observable<any> {
        return this.http.post<any>(
            `${this.apiMeUrl}/user/password/check`,
            params
        );
    }

    passwordChange(params: {}): Observable<any> {
        return this.http.post<any>(
            `${this.apiMeUrl}/user/password/change`,
            params
        );
    }

    setUpliner(uplineId: string) {
        this.ls.setItem('upliner', uplineId);
    }

    setClicks(uplineId: string): boolean {
        const clicks = this.clicks;

        const item = clicks.find((itm) => itm === uplineId);

        if (!item) {
            clicks.push(uplineId);
            this.ls.setItem('clicks', JSON.stringify(clicks));
            return true;
        } else {
            return false;
        }
    }

    removeFromClicks(uplineId: string): boolean {
        const clicks = this.clicks;

        if (clicks && uplineId) {
            const items = clicks.filter((itm) => itm !== uplineId);

            this.ls.setItem('clicks', JSON.stringify(items));
        }

        return true;
    }

    get upliner() {
        return this.ls.getItem('upliner');
    }

    get clicks(): string[] {
        const clicks = this.ls.getItem('clicks');

        return clicks ? clicks : [];
    }
}
