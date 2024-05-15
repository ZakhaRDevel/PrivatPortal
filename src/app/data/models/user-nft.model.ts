import { Model } from 'src/app/core/abstract/model';
import { NftModel } from './nft.model';

export class UserNftModel extends Model {
    id: number;
    customId: number;
    contractId: number;
    nft: NftModel;
    isTransfered: boolean;
    createdAt: string;
}
