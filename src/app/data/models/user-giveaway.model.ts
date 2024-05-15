import { Model } from 'src/app/core/abstract/model';
import { UserModel } from './user.model';

export class UserGiveawayModel extends Model {
    id: number;
    tickets: number;
    place: number;
    user: UserModel;
    telegramConfirmed: boolean;
}
