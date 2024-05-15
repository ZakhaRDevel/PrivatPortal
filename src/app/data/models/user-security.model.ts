import { Model } from 'src/app/core/abstract/model';

export class UserSecurityModel extends Model {
    id: number;
    telegramCode: string;
    lastLoginIp: string;
    lastLoginAt: string;
    googleEnabled: boolean;
}
