import { Model } from 'src/app/core/abstract/model';
import { UserDetailModel } from './user-detail.model';
import { UserQuestionnaireModel } from './user-questionnaire.model';
import { UserSecurityModel } from './user-security.model';
import * as moment from 'moment';
import { UserWalletModel } from './user-wallet.model';

export class UserModel extends Model {
    id: number;
    uplineId: string;
    userUpliner: UserModel;
    nickname: string;
    statusId: number;
    isPreferredMember: boolean;
    email: string;
    phone: string;
    telegram: string;
    walletAddress: string;
    userDetail: UserDetailModel;
    userWallets: UserWalletModel[];
    userQuestionnaire: UserQuestionnaireModel;
    userSecurity: UserSecurityModel;
    emailVerifiedAt: string;
    phoneVerifiedAt: string;
    telegramVerifiedAt: string;
    token: string;
    hasAnnouncement: boolean;
    createdAt: string;
    updatedAt: string;
    earned: number;
    google2fa: boolean;

    get shortEmail(): string {
        const split = this.email.split('@');

        return `${
            split[0].length > 3 ? `${split[0].slice(0, 3)}***` : split[0]
        }@${split[1]}`;
    }

    get lastLogin(): string {
        return this.userSecurity.lastLoginAt
            ? moment(this.userSecurity.lastLoginAt).format(
                  'YYYY-MM-DD HH:mm:ss'
              )
            : '';
    }

    get createdDate(): string {
        return this.createdAt
            ? moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
            : '';
    }
}
