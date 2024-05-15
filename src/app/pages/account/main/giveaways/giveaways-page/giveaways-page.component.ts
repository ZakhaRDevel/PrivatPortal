import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ModalWindowService } from '../../../../../theme/modals/modal-window/modal-window.service';
import { CheckScreenSizeService } from '../../../../../core/services/check-screen-size.service';
import { AuthService } from '../../../../../core/services/auth.service';
import * as moment from 'moment';
import { ModalTabDetailsComponent } from '../../../../../theme/modals/modal-tab-details/modal-tab-details.component';
import { UserModel } from '../../../../../data/models/user.model';
import { PaginationInstance } from 'ngx-pagination';
import { ModalWithdrawComponent } from './modal-withdraw/modal-withdraw.component';
import { ClipboardService } from 'ngx-clipboard';
import { MatDialog } from '@angular/material/dialog';
import { GiveawayService } from 'src/app/data/services/giveaway.service';
import { GiveawayModel } from 'src/app/data/models/giveaway.model';
import { UserGiveawayModel } from 'src/app/data/models/user-giveaway.model';
import { TransactionService } from 'src/app/data/services/transaction.service';
import { TransactionType } from 'src/app/core/enums/transaction-type.enum';
import { TransactionModel } from 'src/app/data/models/transaction.model';
import { PageModel } from 'src/app/data/models/page.models';
import { ActivatedRoute } from '@angular/router';
import { ModalBannerComponent } from 'src/app/theme/modals/modal-banner/modal-banner.component';
import { ScrollService } from '../../../../../core/services/scroll.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
    selector: 'app-giveaways-page',
    templateUrl: './giveaways-page.component.html',
    styleUrls: ['./giveaways-page.component.scss'],
})
export class GiveawaysPageComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('history') history: ElementRef;
    @ViewChild('accordion') accordion: ElementRef;
    @ViewChild('review') review: ElementRef;
    @ViewChild('selectDate') selectDate: NgSelectComponent;

    get rulesTitle() {
        return innerWidth < 1024
            ? this.page.data.rulesMobile
            : this.page.data.rules;
    }

    get link(): string {
        return `${window.location.origin}/${
            this.me.nickname ? this.me.nickname : this.me.uplineId
        }`;
    }
    get me(): UserModel {
        return this.authService.currentUser;
    }
    get datePlaceholder(): string {
        if (!this.datePickerUsed) {
            return '';
        }
        let date = this.date_from
            ? moment(this.date_from).format('YYYY-MM-DD')
            : '';

        if (this.date_from && this.date_to) {
            date = `${date} ~ `;
        }

        if (this.date_to) {
            date = `${date}${moment(this.date_to).format('YYYY-MM-DD')}`;
        }

        return this.date_from || this.date_to ? date : '';
    }
    // ModalDate
    maxDate: any;
    minDate: any;
    date_to: any;
    date_from: any;
    datePickerUsed: boolean;
    loading: boolean;
    filters = {
        orderBy: 'desc',
        orderByValue: 'id',
        date: null,
        payway_id: null,
        type: null,
        period: {
            from: null,
            to: null,
        },
        search: {
            partner_id: '',
        },
        page: {
            from: 0,
            to: 9,
        },
    };

    arrOpenItems = [];
    isCopiedActive: boolean = false;

    page: PageModel;
    pageItem: PageModel;
    pageGeneral: PageModel;
    pageErrors: PageModel;

    data: TransactionModel[] = [];

    config: PaginationInstance = {
        id: 'giveaways_tab',
        itemsPerPage: 10,
        currentPage: 1,
    };
    dateFilter = [
        {
            id: 0,
            days: 7,
            type: '1',
            value: moment().utc().subtract(7, 'days').startOf('day'),
        },
        {
            id: 1,
            days: 30,
            type: '2',
            value: moment().utc().subtract(30, 'days').startOf('day'),
        },
        {
            id: 2,
            days: 90,
            type: '3',
            value: moment().utc().subtract(90, 'days').startOf('day'),
        },
    ];
    selectedDateFilter = this.dateFilter[2];
    itemsPerPage = [10, 50, 100, 250, 500, 1000];

    currentModalData = { id: null, index: null };
    selectedPartnerIndex: number;
    get isMobile(): boolean {
        return innerWidth < 1024 ? true : false;
    }

    giveaways: GiveawayModel[] = [];

    statistic = {
        tickets: 0,
        balance: 0,
        affiliateData: {
            prizeSum: 0,
            refPrizeSum: 0,
            affiliateSum: 0,
        },
    };

    noData: boolean = false;

    isRefDropdownActive: boolean;

    activeTab: string = '';

    get now(): moment.Moment {
        return moment().utc();
    }
    private observer: IntersectionObserver;
    constructor(
        private _clipboardService: ClipboardService,
        private authService: AuthService,
        private modalService: ModalWindowService,
        private matDialog: MatDialog,
        private checkScreenSizeService: CheckScreenSizeService,
        private giveawayService: GiveawayService,
        private transactionService: TransactionService,
        private route: ActivatedRoute,
        private scrollService: ScrollService
    ) {}

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.page = data.page;
            this.pageItem = data.page.giveawayItem;
            this.pageErrors = data.page.errors;
        });

        this.route.parent.parent.parent.data.subscribe((data) => {
            this.pageGeneral = data.page;
        });

        this.giveawayService.index().subscribe((res) => {
            this.giveaways = res.giveaways;
            this.statistic = res.statistic;

            this.createArrAccordionControl();
        });

        this.filter(true);
        setTimeout(() => {
            console.log(this.statistic.tickets);
        }, 1000);
    }

    ngAfterViewInit(): void {
        this.scrollToRevievAndOpenModalWithdraw();
        if (this.scrollService.participate) {
            console.log(this.scrollService.participate);
            setTimeout(() => {
                this.scrollToElem(this.accordion.nativeElement, 136);
                this.scrollService.participate = false;
            }, 300);
        }
    }
    ngOnDestroy(): void {
        this.observer.disconnect;
    }
    filter(init?: boolean) {
        if (this.loading) {
            return;
        }

        const params = {
            order: { id: 'DESC' },
            filter: {
                transactionTypes: [
                    TransactionType.GIVEAWAY_WIN,
                    TransactionType.REFERRAL_FEE,
                ],
            },
            take: this.config.itemsPerPage,
            skip: (this.config.currentPage - 1) * this.config.itemsPerPage,
        };

        if (this.date_to || this.date_from || this.selectedDateFilter) {
            params.filter['createdAt'] = {};

            if (this.date_from) {
                params.filter['createdAt']['date1'] = this.date_from
                    .startOf('day')
                    .toDate();
            }

            if (this.date_to) {
                params.filter['createdAt']['date2'] = this.date_to
                    .endOf('day')
                    .toDate();
            }

            if (this.selectedDateFilter) {
                params.filter['createdAt']['date1'] =
                    this.selectedDateFilter.value.toDate();
            }
        }

        this.transactionService.listPaginate(params).subscribe((response) => {
            this.data = response.items;
            this.config.totalItems = response.count;
            this.loading = false;

            if (init && !this.data.length) {
                this.noData = true;
            }
        });
    }

    createArrAccordionControl() {
        let i = 0;
        this.giveaways.forEach((item) => {
            this.arrOpenItems.push({
                id: i,
                open: false,
            });

            i++;
        });
    }

    copyString(text: string) {
        this._clipboardService.copy(text);
        this.isCopiedActive = true;
        this.isRefDropdownActive = false;
        setTimeout(() => (this.isCopiedActive = false), 2000);
    }

    copyHandler(text: string): void {
        this._clipboardService.copy(text);
        this.isCopiedActive = true;
        this.isRefDropdownActive = false;
        setTimeout(() => (this.isCopiedActive = false), 2000);
    }

    toggleRefDropdown(state: boolean): void {
        if (this.isCopiedActive) {
            this.isCopiedActive = !state;
            this.isRefDropdownActive = state;
        } else {
            this.isRefDropdownActive = state;
        }
    }

    openModal(data: { modalId: string; index?: number }) {
        this.selectDate.close();
        this.selectedPartnerIndex = data.index;
        this.currentModalData.id = data.modalId;
        this.currentModalData.index = data.index;
        this.modalService.open(data.modalId);
    }

    openModalDetails(id, accrual, sum, awardType, item) {
        if (innerWidth < 1280) {
            this.matDialog.open(ModalTabDetailsComponent, {
                data: {
                    refPage: false,
                    title_1: this.page.data.colId,
                    title_2: this.page.data.colDate,
                    title_3: this.page.data.colAmount,
                    title_4: this.page.data.colType,
                    userTitle: this.page.data.userTitle,
                    value_1: id,
                    value_2: accrual,
                    value_3: sum + ' USD',
                    value_4: awardType,
                    item: item,
                },
            });
        }
    }

    openModalWithdraw() {
        const dialog = this.matDialog.open(ModalWithdrawComponent, {
            data: {
                balance: this.statistic.balance,
                page: this.page,
                pageErrors: this.pageErrors,
            },
            backdropClass: 'modalTypeTwoBackdrop',
        });

        dialog.afterClosed().subscribe((data) => {
            if (data) {
                this.statistic.balance -= +data;
            }
        });
    }

    openModalBanner() {
        this.matDialog.open(ModalBannerComponent, {
            data: {
                link: this.link,
                page: this.pageGeneral,
            },
            disableClose: true,
            autoFocus: false,
            maxHeight: '100vh',
            panelClass: 'banner',
        });
    }

    onPeriodChange([date_from, date_to]) {
        this.date_from = date_from;
        this.date_to = date_to;
        this.datePickerUsed = true;
        this.selectedDateFilter = null;
        this.filter();
        this.closeModal('modalDate');
    }

    onDateChange() {
        this.datePickerUsed = false;
        this.filter();
    }

    pageChange(page: number) {
        this.config.currentPage = page;
        this.filter();
    }

    closeModal(modalId: string, refresh?: boolean) {
        this.modalService.close(modalId);
        this.currentModalData.id = null;
        this.currentModalData.index = null;
        if (refresh) {
        }
    }

    onCreate(data: any, item: GiveawayModel) {
        this.statistic.tickets -= +data.tickets;
        const index = this.giveaways.findIndex((itm) => itm.id === item.id);

        this.giveaways[index].tickets = +data.userGiveaway.tickets;

        const ugIndex = this.giveaways[index].userGiveaways.findIndex(
            (itm) => itm.id == data.userGiveaway.id
        );

        if (this.giveaways[index].userGiveaways[ugIndex]) {
            this.giveaways[index].userGiveaways[ugIndex] = data.userGiveaway;
        } else {
            this.giveaways[index].userGiveaways.push(data.userGiveaway);
        }
    }

    scrollToElem(elem, offsetCorrect = 0) {
        let bodyRect = document.body.getBoundingClientRect();
        let elemRect = elem.getBoundingClientRect();
        let offset = elemRect.top - bodyRect.top;
        scrollTo(0, offset - offsetCorrect);
    }

    scrollToRevievAndOpenModalWithdraw() {
        if (this.scrollService.enableScroll) {
            setTimeout(() => {
                this.scrollToElem(this.review.nativeElement, 130);
                this.openModalWithdraw();
                this.scrollService.enableScroll = false;
            }, 500);
        }
    }

    // addClassBtn() {
    //     const block = document.querySelectorAll('.block__container');
    //     const btn = document.querySelectorAll('.btn-anchor');

    //     const cb = (enteries) => {
    //         // enteries.forEach((entry) => {
    //         //     if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
    //         //         btn.forEach((link) => link.classList.remove('active'));
    //         //         const activeId = entry.target.id;
    //         //         const activeLink = document.querySelector(
    //         //             `.btn-anchor[${activeId}]`
    //         //         );

    //         //         if (activeLink) {
    //         //             activeLink.classList.add('active');
    //         //         }
    //         //     }
    //         // });

    //         enteries.forEach((entry) => {
    //             if (entry.isIntersecting && entry.intersectionRatio > 0.5)
    //                 btn.forEach((btn) => {
    //                     btn.classList.toggle(
    //                         'active',
    //                         btn.getAttribute(`data`) === entry.target.id
    //                     );
    //                 });
    //         });
    //     };

    //     const sectionObserver = new IntersectionObserver(cb, {
    //         threshold: [0, 0.25, 0.5, 0.8],
    //     });

    //     block.forEach((s) => sectionObserver.observe(s));
    // }

    // scrollSpy() {
    //     const onScrollUpdate = (entry, isInVewPort) => {
    //         const { target, boundingClientRect } = entry;
    //         const menuItem = document.querySelector(
    //             `[data-scrollspy-id="${target.id}"]`
    //         );

    //         if (boundingClientRect.y <= 0 && isInVewPort(entry)) {
    //             menuItem.classList.add('active');
    //         } else {
    //             if (menuItem.classList.contains('active')) {
    //                 menuItem.classList.remove('active');
    //             }
    //         }
    //     };
    //     const isInViewPort = (entry, offset = 0) => {
    //         const rect = entry.boundingClientRect;
    //         return rect.top - 1 <= 0 + offset && rect.bottom >= 0 + offset;
    //     };

    //     const scrollables = document.querySelectorAll('[data-scrollspy]');
    //     scrollables.forEach((scrollable) => {
    //         this.observer = new IntersectionObserver(
    //             (entries) => {
    //                 entries.forEach((entry) => {
    //                     onScrollUpdate && onScrollUpdate(entry, isInViewPort);
    //                 });
    //             },
    //             {
    //                 root: null,
    //                 rootMargin: '0px 0px 100% 0px',
    //                 threshold: [
    //                     0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0,
    //                 ],
    //             }
    //         );
    //         this.observer.observe(scrollable);
    //     });
    // }

    @HostListener('document:scroll', ['$event'])
    public onViewportScroll() {
        const windowHeight = window.innerHeight;
        const historyRect = this.history.nativeElement.getBoundingClientRect();
        const accordionRect =
            this.accordion.nativeElement.getBoundingClientRect();
        const reviewRect = this.review.nativeElement.getBoundingClientRect();

        if (historyRect.top - 137 <= 0 && historyRect.bottom <= windowHeight) {
            this.activeTab = 'history';
        } else if (
            accordionRect.top - 137 <= 0 &&
            accordionRect.bottom <= windowHeight
        ) {
            this.activeTab = 'accordion';
        } else if (
            reviewRect.top - 137 <= 0 &&
            reviewRect.bottom <= windowHeight
        ) {
            this.activeTab = 'review';
        } else {
            this.activeTab = '';
        }
    }
}
