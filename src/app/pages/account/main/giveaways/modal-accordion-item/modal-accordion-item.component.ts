import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalTicketsComponent } from '../giveaways-page/modal-tickets/modal-tickets.component';
import { ModalTelegramComponent } from '../giveaways-page/modal-telegram/modal-telegram.component';
import { GiveawayModel } from 'src/app/data/models/giveaway.model';
import { interval, Subscription } from 'rxjs';
import { PageModel } from 'src/app/data/models/page.models';
import { UserModel } from 'src/app/data/models/user.model';
import * as moment from 'moment';
import { UserGiveawayModel } from 'src/app/data/models/user-giveaway.model';

@Component({
    selector: 'app-modal-accordion-item',
    templateUrl: './modal-accordion-item.component.html',
    styleUrls: ['./modal-accordion-item.component.scss'],
})
export class ModalAccordionItemComponent implements OnInit, AfterViewInit {
    isOpen: string = '';
    active: boolean;
    endTime: moment.Moment;
    more: boolean = false;

    countdown: moment.Duration;

    subscription: Subscription;

    @Output() onCreateEvent: EventEmitter<number> = new EventEmitter<number>();
    @ViewChild('percent') percent: ElementRef;
    telegramVerified: boolean = false;
    telegramChecked: boolean = false;
    get now(): moment.Moment {
        return moment().utc();
    }

    get myGiveaway(): UserGiveawayModel {
        return this.data.giveaway.userGiveaways.find(
            (itm) => +itm.user?.id === +this.data.me.id
        );
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
        if (this.data.isArchive) {
            return '0';
        }
        const d = this.countdownString.split(':')[0];
        return +d ? d : '00';
    }

    get hours(): string {
        if (this.data.isArchive) {
            return '0';
        }
        const h = this.countdownString.split(':')[1];
        return +h ? h : '00';
    }

    get minutes(): string {
        if (this.data.isArchive) {
            return '0';
        }
        const m = this.countdownString.split(':')[2] || '';
        return +m ? m : '00';
    }

    get seconds(): string {
        if (this.data.isArchive) {
            return '0';
        }
        const s = this.countdownString.split(':')[3] || '';
        return +s ? s : '00';
    }

    get declOfNum() {
        let titles = [
            this.data.page.data.modalTickets.ticket1,
            this.data.page.data.modalTickets.ticket2,
            this.data.page.data.modalTickets.ticket3,
        ];
        let cases = [2, 0, 1, 1, 1, 2];
        return titles[
            this.ticketsValue % 100 > 4 && this.ticketsValue % 100 < 20
                ? 2
                : cases[this.ticketsValue % 10 < 5 ? this.ticketsValue % 10 : 5]
        ];
    }

    get ticketsValue() {
        return this.data.giveaway.tickets
            ? this.data.giveaway.tickets
            : +this.data.currentTickets || 0;
    }

    constructor(
        private matDialogRef: MatDialogRef<ModalAccordionItemComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            giveaway: GiveawayModel;
            page: PageModel;
            pageErrors: PageModel;
            pageGeneral: PageModel;
            isArchive: boolean;
            tickets: number;
            currentTickets: number;
            me: UserModel;
        },
        private router: Router,
        private matDialog: MatDialog
    ) {
        if (!this.data.isArchive) {
            this.endTime = moment(this.data.giveaway.endAt).local();
            this.initTimer();
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        requestAnimationFrame(this.step);
    }

    initTimer() {
        this.countdown = moment.duration(this.endTime.seconds(), 's');

        this.subscription = interval(1000).subscribe(() => {
            this.countdown = moment.duration(
                this.endTime.diff(moment().local())
            );

            if (this.countdown.asSeconds() <= 0) {
                this.subscription.unsubscribe();
            }
        });
    }

    step = () => {
        const start = moment(this.data.giveaway.startAt).unix();
        const end = moment(this.data.giveaway.endAt).unix();
        const now = moment().unix();

        const unix1 = now - start;
        const unix2 = end - start;
        const percent = (unix1 / unix2) * 100;
        this.percent.nativeElement.style.strokeDashoffset = percent;

        if (percent !== 0) {
            window.requestAnimationFrame(this.step);
        }
    };

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
        const dialog = this.matDialog.open(ModalTicketsComponent, {
            data: {
                tickets: this.data.tickets,
                giveawayId: +this.data.giveaway.id,
                page: this.data.page,
                pageErrors: this.data.pageErrors,
            },
            backdropClass: 'modalTypeTwoBackdrop',
            autoFocus: false,
        });

        dialog.afterClosed().subscribe((data) => {
            if (data) {
                console.log(data);
                setTimeout(() => this.matDialogRef.close(data), 300);
            }
        });
    }

    openModalTelegram(type: string = '') {
        if (type) {
            const dialog = this.matDialog.open(ModalTelegramComponent, {
                data: {
                    type: type,
                    giveawayId: this.data.giveaway.id,
                    page: this.data.page,
                    pageErrors: this.data.pageErrors,
                    pageGeneral: this.data.pageGeneral,
                },
                backdropClass: 'modalTypeTwoBackdrop',
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

    modalClose() {
        setTimeout(() => this.matDialogRef.close(), 300);
    }

    checkTitle(title) {
        console.log(title);
    }
}
