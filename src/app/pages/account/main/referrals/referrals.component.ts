import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ClipboardService } from 'ngx-clipboard';
import { PaginationInstance } from 'ngx-pagination';
import { AuthService } from 'src/app/core/services/auth.service';
import { CheckScreenSizeService } from 'src/app/core/services/check-screen-size.service';
import { PageModel } from 'src/app/data/models/page.models';
import { UserModel } from 'src/app/data/models/user.model';
import { ModalTabDetailsComponent } from 'src/app/theme/modals/modal-tab-details/modal-tab-details.component';
import { ModalWindowService } from 'src/app/theme/modals/modal-window/modal-window.service';
import { ModalBannerComponent } from 'src/app/theme/modals/modal-banner/modal-banner.component';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { UserService } from 'src/app/data/services/user.service';
import { HiddenMenuService } from 'src/app/core/services/hidden-menu.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
    templateUrl: './referrals.component.html',
    styleUrls: ['./referrals.component.scss'],
    animations: [
        trigger('toggle', [
            state(
                'shown',
                style({ height: '*', opacity: '*', overflow: 'hidden' })
            ),
            state(
                'hidden',
                style({ height: '0', opacity: '0', overflow: 'hidden' })
            ),
            transition('hidden <=> shown', animate('0.3s')),
            transition('hidden <=> shown', animate('0.3s')),
        ]),
    ],
})
export class ReferralsComponent implements OnInit {
    data: UserModel[] = [];

    // Pagination
    maxSize: number = 7;
    config: PaginationInstance = {
        id: 'ref',
        itemsPerPage: 10,
        currentPage: 1,
    };
    pagLenghtText;
    // Pagination

    // Select
    @ViewChild('selectDate') selectDate: NgSelectComponent;
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
    itemsPerPage = [1, 10, 50, 100, 250, 500, 1000];
    kw: string;
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
    isOpenDateSelect: boolean;
    // Select

    // CopyLink
    isCopiedActive: boolean;
    get link(): string {
        return `${window.location.origin}/${
            this.me.nickname ? this.me.nickname : this.me.uplineId
        }`;
    }
    isRefDropdownActive;
    // CopyLink

    // ModalDate
    date_to: any;
    date_from: any;
    datePickerUsed: boolean;
    loading: boolean;

    shown = false;
    currentModalData = { id: null, index: null };
    selectedPartnerIndex: number;
    // ModalDate

    // Other

    page: PageModel;
    pageGeneral: PageModel;
    get isMobile(): boolean {
        return innerWidth < 1024 ? true : false;
    }
    get me(): UserModel {
        return this.authService.currentUser;
    }

    statistic = {
        chart: {
            today: 0,
            week: 0,
            month: 0,
            all: 0,
            data: [],
        },
        clicks: 0,
        registers: 0,
        conversion: 0,
    };

    chart = [];

    searchTimeout: any = null;

    noData: boolean = false;

    // get isSearch() {
    //     return this.kw?.length ||
    // }

    constructor(
        private _clipboardService: ClipboardService,
        private authService: AuthService,
        private userService: UserService,
        private route: ActivatedRoute,
        private matDialog: MatDialog,
        private modalService: ModalWindowService,
        private hiddenMenuService: HiddenMenuService
    ) {}

    ngOnInit(): void {
        this.hiddenMenuService.close();
        this.route.data.subscribe((data) => {
            this.page = data.page;
        });
        this.route.parent.data.subscribe((data) => {
            this.pageGeneral = data.page;
        });

        this.userService.affiliateTotal().subscribe((res) => {
            let conversion = (+res.registers / +res.clicks) * 100 || 0;

            if (conversion.toString().split('.')[1]) {
                conversion = +conversion.toFixed(2);
            }

            res['conversion'] = conversion;
            this.statistic = res;

            let total = 0;
            this.statistic.chart.data.forEach((itm) => {
                total += +itm.count;
            });
            for (const itm of this.statistic.chart.data) {
                this.chart.push({
                    date: itm.date,
                    count: itm.count,
                    percent: (+itm.count / total) * 100 || 0,
                });
            }
        });

        this.filter(true);
    }

    copyHandler(text: string): void {
        this.isCopiedActive = true;
        this._clipboardService.copy(text);
        setTimeout(() => (this.isCopiedActive = false), 2000);
    }

    copyString(text: string) {
        if (!this.isMobile) {
            this._clipboardService.copy(text);
            this.isCopiedActive = true;
            this.isRefDropdownActive = false;
            setTimeout(() => (this.isCopiedActive = false), 2000);
        }
    }

    openModalDetails(id, registr, name, earnings, telegram, userDetail) {
        if (innerWidth < 1280) {
            this.matDialog.open(ModalTabDetailsComponent, {
                data: {
                    refPage: true,
                    title_1: this.page.data.colId,
                    title_2: this.page.data.colCreated,
                    title_3: this.page.data.colName,
                    title_4: this.page.data.colEarned,
                    title_5: this.page.data.colContact,
                    value_1: id,
                    value_2: registr,
                    value_3: name,
                    value_4: earnings,
                    telegram: telegram,
                    userTitle: this.page.data.user,
                    userDetail: userDetail,
                },
            });
        }
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
            panelClass: 'overflow',
        });
    }

    openModal(data: { modalId: string; index?: number }) {
        this.selectDate.close();
        this.selectedPartnerIndex = data.index;
        this.currentModalData.id = data.modalId;
        this.currentModalData.index = data.index;
        this.modalService.open(data.modalId);
    }

    closeModal(modalId: string, refresh?: boolean) {
        this.modalService.close(modalId);
        this.currentModalData.id = null;
        this.currentModalData.index = null;
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

    onSearch() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.pageChange(1);
        }, 1000);
    }

    filter(init?: boolean) {
        if (this.loading) {
            return;
        }

        const params = {
            order: { id: 'DESC' },
            filter: {},
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

        if (this.kw?.length > 0) {
            params.filter['userDetail'] = this.kw.toLowerCase();
        }

        this.userService.affiliatePartners(params).subscribe((response) => {
            this.data = response.items;
            this.config.totalItems = response.count;
            this.loading = false;

            if (init && !this.data.length) {
                this.noData = true;
            }
        });
    }

    toggleRefDropdown(state: boolean): void {
        if (this.isCopiedActive) {
            this.isCopiedActive = !state;
            this.isRefDropdownActive = state;
        } else {
            this.isRefDropdownActive = state;
        }
    }
}
