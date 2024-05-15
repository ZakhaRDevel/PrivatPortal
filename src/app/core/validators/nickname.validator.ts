import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nicknameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        // REGEX = /^\d{1,20}$/;

        if (!control.value?.length || control.value?.length > 20) {
            return { nicknameLength: true };
        }
        const REGEX = /^[A-Za-z0-9]+$/i;
        const PC_REGEX = /^[Pp][Cc]\d{1,}$/;
        const stopWords = [
            'acc',
            'account',
            'admin',
            'advertising',
            'affiliate',
            'airdrop',
            'activities',
            'announcement',
            'announcements',
            'api',
            'back',
            'blockchain',
            'blog',
            'bonus',
            'club',
            'dashboard',
            'enjoy',
            'enter',
            'freenft',
            'getnft',
            'giveaway',
            'giveaways',
            'go',
            'legal',
            'login',
            'market',
            'marketing',
            'news',
            'nft',
            'password',
            'privat',
            'privatclub',
            'promo',
            'pvt',
            'readme',
            'recover',
            'register',
            'reset',
            'resetpassword',
            'roadmap',
            'referrals',
            'shop',
            'store',
            'signin',
            'signup',
            'start',
            'support',
            'token',
            'whitepaper',
            '50usd',
        ];

        if (stopWords.includes(control.value.toLowerCase())) {
            return { nicknameExist: true };
        }
        if (!REGEX.test(control.value)) {
            return { numeric: true };
        }
        if (PC_REGEX.test(control.value)) {
            return { nicknameExist: true };
        }

        return null;
    };
}
