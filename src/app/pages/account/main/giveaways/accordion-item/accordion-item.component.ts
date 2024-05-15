import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { PageModel } from '../../../../../data/models/page.models';
import { ModalWithdrawComponent } from '../giveaways-page/modal-withdraw/modal-withdraw.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalTicketsComponent } from '../giveaways-page/modal-tickets/modal-tickets.component';
import { ModalTelegramComponent } from '../giveaways-page/modal-telegram/modal-telegram.component';
import { ModalAccordionItemComponent } from '../modal-accordion-item/modal-accordion-item.component';
import { GiveawayModel } from 'src/app/data/models/giveaway.model';
import * as moment from 'moment';
import { interval, Subscription } from 'rxjs';
import { UserModel } from 'src/app/data/models/user.model';
import { GiveawayService } from 'src/app/data/services/giveaway.service';
import { UserService } from 'src/app/data/services/user.service';
import { UserGiveawayModel } from 'src/app/data/models/user-giveaway.model';

@Component({
    selector: 'app-accordion-item',
    templateUrl: './accordion-item.component.html',
    styleUrls: ['./accordion-item.component.scss'],
    animations: [
        trigger('toggle', [
            state(
                'shown',
                style({
                    height: '*',
                    opacity: '*',
                    overflow: 'hidden',
                    padding: '*',
                    margin: '*',
                })
            ),
            state(
                'hidden',
                style({
                    height: '0',
                    opacity: '0',
                    overflow: 'hidden',
                    padding: '0',
                    margin: '0',
                })
            ),
            transition('hidden <=> shown', animate('0.25s')),
            transition('hidden <=> shown', animate('0.25s')),
        ]),
        trigger('modal', [
            transition('void => *', [
                style({ transform: 'scale3d(.3, .3, .3)' }),
                animate(200),
            ]),
            transition('* => void', [
                animate(200, style({ transform: 'scale3d(.0, .0, .0)' })),
            ]),
        ]),
    ],
})
export class AccordionItemComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @Input() giveaway: GiveawayModel;
    @Input() page: PageModel;
    @Input() pageErrors: PageModel;
    @Input() isArchive: boolean = false;
    @Input() tickets: number = 0;
    @Input() currentTickets: number = 0;
    @Input() me: UserModel;
    @Input() isActive: boolean;
    @Input() pageGeneral: PageModel;

    @ViewChild('percent') percent: ElementRef;

    isOpen: string = '';
    active: boolean;

    endTime: moment.Moment;

    countdown: moment.Duration;

    subscription: Subscription;

    telegramVerified: boolean = false;
    telegramChecked: boolean = false;

    @Output() onCreateEvent: EventEmitter<number> = new EventEmitter<number>();
    @Output() openModalGiveaway: EventEmitter<GiveawayModel> =
        new EventEmitter<GiveawayModel>();
    get now(): moment.Moment {
        return moment().utc();
    }
    get countdownString(): string {
        if (this.countdown) {
            let d: string | number = Math.floor(this.countdown.asDays());
            d = d < 10 ? `0${d}` : `${d}`;
            let h: string | number = Math.floor(this.countdown.hours());
            h = h < 10 ? `0${h}` : `${h}`;
            const m = `0${this.countdown.minutes()}`.slice(-2);
            const s = `0${this.countdown.seconds()}`.slice(-2);

            return `${d}:${h}:${m}:${s}`;
        }

        return '';
    }

    get days(): string {
        if (this.isArchive) {
            return '0';
        }
        const d = this.countdownString.split(':')[0];
        return +d ? d : '00';
    }

    get hours(): string {
        if (this.isArchive) {
            return '0';
        }
        const h = this.countdownString.split(':')[1];
        return +h ? h : '00';
    }

    get minutes(): string {
        if (this.isArchive) {
            return '0';
        }
        const m = this.countdownString.split(':')[2] || '';
        return +m ? m : '00';
    }

    get seconds(): string {
        if (this.isArchive) {
            return '0';
        }
        const s = this.countdownString.split(':')[3] || '';
        return +s ? s : '00';
    }

    get myGiveaway(): UserGiveawayModel {
        return this.giveaway.userGiveaways.find(
            (itm) => +itm.user?.id === +this.me.id
        );
    }

    get ticketsValue() {
        return this.giveaway.tickets
            ? this.giveaway.tickets
            : +this.currentTickets || 0;
    }

    get declOfNum() {
        let titles = [
            this.page.data.modalTickets.ticket1,
            this.page.data.modalTickets.ticket2,
            this.page.data.modalTickets.ticket3,
        ];
        let cases = [2, 0, 1, 1, 1, 2];
        return titles[
            this.ticketsValue % 100 > 4 && this.ticketsValue % 100 < 20
                ? 2
                : cases[this.ticketsValue % 10 < 5 ? this.ticketsValue % 10 : 5]
        ];
    }

    constructor(
        private matDialog: MatDialog,
        private giveawayService: GiveawayService,
        private userService: UserService
    ) {}

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        if (!this.isArchive) {
            this.endTime = moment(this.giveaway.endAt).local();
            this.initTimer();
        }

        if (this.isActive && innerWidth >= 1024) {
            this.isOpen = `accordion_${this.giveaway.id}`;
        }
    }
    ngAfterViewInit(): void {
        requestAnimationFrame(this.step);
    }

    initTimer() {
        this.countdown = moment.duration(this.endTime.seconds(), 's');
        this.calcCountdown();
        this.subscription = interval(1000).subscribe(() => {
            this.calcCountdown();
        });
    }

    step = () => {
        const start = moment(this.giveaway.startAt).unix();
        const end = moment(this.giveaway.endAt).unix();
        const now = moment().unix();

        const unix1 = now - start;
        const unix2 = end - start;
        const percent = (unix1 / unix2) * 100;
        this.percent.nativeElement.style.strokeDashoffset = percent;

        if (percent !== 0) {
            window.requestAnimationFrame(this.step);
        }
    };

    calcCountdown() {
        this.countdown = moment.duration(this.endTime.diff(moment().local()));

        if (this.countdown.asSeconds() <= 0) {
            this.subscription.unsubscribe();
        }
    }

    toggleAccordionMenu(id) {
        if (this.isOpen === id) {
            this.isOpen = '';
            this.active = false;
        } else {
            this.isOpen = id;
            this.active = true;
        }
    }

    openModalTicket() {
        // if (
        //     this.currentTickets > 0 ||
        //     !this.tickets ||
        //     this.giveaway.tickets > 0
        // ) {
        //     return;
        // }
        const dialog = this.matDialog.open(ModalTicketsComponent, {
            data: {
                tickets: this.tickets,
                giveawayId: +this.giveaway.id,
                pageErrors: this.pageErrors,
                page: this.page,
            },
        });

        dialog.afterClosed().subscribe((data) => {
            if (data) {
                this.onCreateEvent.emit(data);
            }
        });
    }

    openModalTelegram(type: string = '') {
        // if (!this.myGiveaway) {
        //     return;
        // }
        if (type) {
            const dialog = this.matDialog.open(ModalTelegramComponent, {
                data: {
                    type: type,
                    giveawayId: this.giveaway.id,
                    pageErrors: this.pageErrors,
                    pageGeneral: this.pageGeneral,
                    page: this.page,
                },
            });

            dialog.afterClosed().subscribe((data) => {
                if (data) {
                    if (data.isSuccessful && data.type === 'type_plug') {
                        this.telegramVerified = true;
                    }
                    if (data.isSuccessful && data.type === 'type_check') {
                        this.telegramChecked = true;
                    }
                }
            });
        }
    }

    openModalItem() {
        const dialog = this.matDialog.open(ModalAccordionItemComponent, {
            data: {
                giveaway: this.giveaway,
                pageErrors: this.pageErrors,
                pageGeneral: this.pageGeneral,
                page: this.page,
                isArchive: this.isArchive,
                tickets: this.tickets,
                currentTickets: this.currentTickets,
                me: this.me,
            },
        });

        dialog.afterClosed().subscribe((data) => {
            if (data) {
                this.onCreateEvent.emit(data);
            }
        });
    }
}
