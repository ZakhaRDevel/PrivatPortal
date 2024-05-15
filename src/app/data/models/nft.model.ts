import { Model } from 'src/app/core/abstract/model';

export class NftModel extends Model {
    id: number;
    isActive: boolean;
    logo: string;
    price: number;
    slug: string;

    get logoUrl(): string {
        return `/assets/img/nft/${this.slug}.png`;
    }
}
