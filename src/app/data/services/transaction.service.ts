import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { TransactionType } from 'src/app/core/enums/transaction-type.enum';
import { ModelApiService } from '../../core/abstract/model-api.service';
import { GiveawayModel } from '../models/giveaway.model';
import { NftModel } from '../models/nft.model';
import { TransactionDataModel } from '../models/transaction-data.model';
import { TransactionStatusModel } from '../models/transaction-status.model';
import { TransactionTypeModel } from '../models/transaction-type.model';
import { TransactionModel } from '../models/transaction.model';
import { UserNftModel } from '../models/user-nft.model';

@Injectable({
    providedIn: 'root',
})
export class TransactionService extends ModelApiService {
    list(params: {}): Observable<TransactionModel[]> {
        return this.http
            .get(
                `${
                    this.apiMeUrl
                }/transaction?take=10&skip=0&page=1&limit=10&filter=${JSON.stringify(
                    params
                )}`
            )
            .pipe(
                map((data: any) => {
                    return TransactionModel.fromJsonArray(data.data).map(
                        (itm) => {
                            itm.transactionType = TransactionTypeModel.fromJson(
                                itm.transactionType,
                                this.langService
                            );
                            itm.transactionStatus =
                                TransactionStatusModel.fromJson(
                                    itm.transactionStatus,
                                    this.langService
                                );
                            itm.data = new TransactionDataModel(
                                itm.data,
                                itm.transactionType.id
                            );

                            return itm;
                        }
                    );
                })
            );
    }

    listPaginate(params: any): Observable<any> {
        return this.http
            .get(
                `${this.apiMeUrl}/transaction?take=${
                    params.take
                }&order=${JSON.stringify(params.order)}&skip=${
                    params.skip
                }&page=1&limit=10&filter=${JSON.stringify(params.filter)}`
            )
            .pipe(
                map((data: any) => {
                    const items = TransactionModel.fromJsonArray(data.data).map(
                        (itm) => {
                            itm.transactionType = TransactionTypeModel.fromJson(
                                itm.transactionType,
                                this.langService
                            );
                            itm.transactionStatus =
                                TransactionStatusModel.fromJson(
                                    itm.transactionStatus,
                                    this.langService
                                );

                            itm.data = new TransactionDataModel(
                                itm.data,
                                itm.transactionType.id
                            );

                            if (
                                itm.transactionType.id ===
                                TransactionType.GIVEAWAY_WIN
                            ) {
                                itm.data.giveaway = GiveawayModel.fromJson(
                                    itm.data.giveaway,
                                    this.langService
                                );
                            }

                            return itm;
                        }
                    );

                    return {
                        items,
                        count: data.count,
                    };
                })
            );
    }
}
