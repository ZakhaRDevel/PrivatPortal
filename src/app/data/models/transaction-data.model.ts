import { TransactionType } from 'src/app/core/enums/transaction-type.enum';
import { GiveawayModel } from './giveaway.model';

export class TransactionDataModel {
    amount: number;
    network: string = 'Polygon';
    fee: string;
    address: string;
    hash: string;
    refferalId: string;
    place: string;
    giveaway: GiveawayModel;
    refAmount: string;

    constructor(data: any, typeId: TransactionType) {
        if (data) {
            switch (typeId) {
                case TransactionType.NFT_RECEIVE:
                    this.amount = data.userNft.nft.price;
                    break;
                case TransactionType.NFT_TRANSFER:
                    this.amount = data.userNft.nft.price;
                    this.fee = (data.fee ? `${data.fee}` : '0.00') + ' MATIC';
                    this.address = data.wallet;
                    this.hash = data.hash;
                    break;
                case TransactionType.GIVEAWAY_WIN:
                    this.amount = data.amount;
                    this.place = data.userGiveaway.place;
                    this.giveaway = data.userGiveaway.giveaway;
                    break;
                case TransactionType.REFERRAL_FEE:
                    this.amount = data.amount;
                    this.refferalId = `PC${data.userGiveaway.user.uplineId}`;
                    this.refAmount = data.fromAmount;
                    break;
                case TransactionType.WITHDRAWAL:
                    this.amount = data.amount;
                    this.address = data.address;
                    // this.hash = data.hash;
                    // this.fee = data.fee;
                    break;
                default:
            }
        }
    }

    get shortAddress(): string {
        return this.address
            ? `${this.address.slice(0, 5)}...${this.address.slice(
                  this.address.length - 5,
                  this.address.length
              )}`
            : '';
    }

    get shortHash(): string {
        return this.hash
            ? `${this.hash.slice(0, 5)}...${this.hash.slice(
                  this.hash.length - 5,
                  this.hash.length
              )}`
            : '';
    }
}
