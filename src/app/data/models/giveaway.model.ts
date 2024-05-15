import * as moment from 'moment';
import { TranslatableModel } from 'src/app/core/abstract/translatable-model';
import { GiveawayCategoryModel } from './giveaway-category.model';
import { GiveawayTranslationModel } from './giveaway-translation.model';
import { UserGiveawayModel } from './user-giveaway.model';

export class GiveawayModel extends TranslatableModel {
    id: number;
    giveawayCategory: GiveawayCategoryModel;
    startAt: string;
    endAt: string;
    isCompleted: boolean;
    userGiveaways: UserGiveawayModel[];
    translations: GiveawayTranslationModel[];
    title: string;
    conditions: string;
    prizes: string;
    locale: string;
    tickets: number = 0;
    prizeGroup: {
        title: string;
        place: string;
    }[] = [];
    winners: { place: number; userId: string; prize: string }[] = [];
    conditionsList: string[];
    prizeList: string[] = [];

    get endDate(): string {
        return this.endAt
            ? moment(this.endAt).local().format('YYYY-MM-DD')
            : '';
    }

    get startDate(): string {
        return this.startAt ? moment(this.startAt).format('YYYY-MM-DD') : '';
    }

    get fullEndDate(): moment.Moment {
        return this.endAt ? moment(this.endAt) : null;
    }

    initConditions() {
        if (this.conditions) {
            this.conditionsList = JSON.parse(this.conditions);
        }
    }

    initPrizeList() {
        if (this.prizes) {
            this.prizeList = JSON.parse(this.prizes);
        }
    }

    initPrizes() {
        const prizes = this.prizes ? JSON.parse(this.prizes) : [];

        const group = [];

        for (const itm of prizes) {
            const index = group.findIndex((el) => el.title === itm.title);

            if (!group[index]?.place) {
                group.push({
                    title: itm.title,
                    place: `${itm.place}`,
                });
            } else {
                if (group[index].place.includes('-')) {
                    group[index].place = `${group[index].place.split('-')[0]}-${
                        itm.place
                    }`;
                } else {
                    group[index].place = `${group[index].place}-${itm.place}`;
                }
            }
        }

        this.prizeGroup = group;
    }

    initWinners() {
        this.winners = this.userGiveaways
            .filter((itm) => itm.place)
            .sort((a, b) => +a.place - +b.place)
            .map((itm) => {
                const prize = this.prizeList.find(
                    (el) => +el['place'] === +itm.place
                );

                return {
                    place: itm.place,
                    prize: prize['title'],
                    userId: ` PC${itm.user.uplineId}`,
                };
            });
    }

    prepareData() {
        this.initConditions();
        this.initPrizeList();
        this.initPrizes();
        this.initWinners();
    }
}
