import { TranslatableModel } from 'src/app/core/abstract/translatable-model';

export class TransactionTypeModel extends TranslatableModel {
    id: number;
    title: string;
    description: string;
}
