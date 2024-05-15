import { Model } from 'src/app/core/abstract/model';

export class UserQuestionnaireModel extends Model {
    id: number;
    isInvestor: boolean;
    isTrader: boolean;
    isBlogger: boolean;
    isFreelancer: boolean;
    isCurrencyExchanger: boolean;
    isEntrepreneur: boolean;
    isEmployed: boolean;
    isOther: boolean;
    hasMlmExperience: boolean;
    projectName: string;
    partnersCount: string;
    trustLevel: string;
    isStartTeam: boolean;
    isCompleted: boolean;
    createdAt: string;
    updatedAt: string;
}
