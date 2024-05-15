import * as moment from 'moment';
import { Model } from 'src/app/core/abstract/model';
import { TransactionDataModel } from './transaction-data.model';
import { TransactionStatusModel } from './transaction-status.model';
import { TransactionTypeModel } from './transaction-type.model';

export class TransactionModel extends Model {
    customId: number;
    createdAt: string;
    transactionStatus: TransactionStatusModel;
    transactionType: TransactionTypeModel;
    data: TransactionDataModel;

    get createdDate(): string {
        return this.createdAt
            ? moment(this.createdAt).format('YYYY-MM-DD')
            : '';
    }

    get fullCreatedDate(): string {
        return this.createdAt
            ? moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
            : '';
    }
}
