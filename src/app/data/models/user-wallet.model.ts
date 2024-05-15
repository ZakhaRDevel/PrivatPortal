import { Model } from 'src/app/core/abstract/model';

export class UserWalletModel extends Model {
    id: number;
    wallet: string;
    networkId: number;
    createdAt: Date;
    updatedAt: Date;

    get shortAddress(): string {
        return this.wallet
            ? `${this.wallet.slice(0, 5)}...${this.wallet.slice(
                  this.wallet.length - 5,
                  this.wallet.length
              )}`
            : '';
    }

    get networkCode(): string {
        switch (this.networkId) {
            case 1:
                return 'ERC20';
            case 2:
                return 'TRC20';
            default:
                return '';
        }
    }
}
