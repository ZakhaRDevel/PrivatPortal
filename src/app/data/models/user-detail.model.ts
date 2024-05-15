import { Model } from 'src/app/core/abstract/model';
import { CountryModel } from './country.model';

export class UserDetailModel extends Model {
    id: number;
    fullName: string;
    twitterUrl: string;
    facebookUrl: string;
    linkedinUrl: string;
    instagramUrl: string;
    tiktokUrl: string;
    customUrl: string;
    country: CountryModel;
    createdAt: Date;
    updatedAt: Date;

    hideTelegram: boolean;
    hideFullName: boolean;
    hideTwitter: boolean;
    hideFacebook: boolean;
    hideLinkedIn: boolean;
    hideInstagram: boolean;
    hideTiktok: boolean;
}
