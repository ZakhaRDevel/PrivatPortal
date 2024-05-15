import { Model } from '../../core/abstract/model';

export class CountryModel extends Model {
    id: number;
    title: string;
    code: string;
    phoneCode: string;
    order: number;
    orderPhone: number;
    logo: string;
    useAtPhone: boolean;
}
