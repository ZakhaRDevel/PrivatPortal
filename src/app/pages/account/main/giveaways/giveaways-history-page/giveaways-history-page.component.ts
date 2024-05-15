import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from 'src/app/core/services/auth.service';
import { CheckScreenSizeService } from 'src/app/core/services/check-screen-size.service';
import { GiveawayCategoryModel } from 'src/app/data/models/giveaway-category.model';
import { GiveawayModel } from 'src/app/data/models/giveaway.model';
import { PageModel } from 'src/app/data/models/page.models';
import { UserModel } from 'src/app/data/models/user.model';
import { GiveawayService } from 'src/app/data/services/giveaway.service';
import { ModalWindowService } from 'src/app/theme/modals/modal-window/modal-window.service';

@Component({
    selector: 'app-giveaways-history-page',
    templateUrl: './giveaways-history-page.component.html',
    styleUrls: ['./giveaways-history-page.component.scss'],
})
export class GiveawaysHistoryPageComponent implements OnInit {
    isArchive = true;
    selectedDateFilter: GiveawayCategoryModel;
    isMobile = this.checkScreenSizeService.isMobile;
    selectedPartnerIndex: number;
    currentModalData = { id: null, index: null };
    btnGreen = false;
    check;
    isClosing: boolean = false;
    typeTwo = true;

    giveaways: GiveawayModel[] = [];
    categories: GiveawayCategoryModel[] = [];

    perPage: number = 10;
    page: number = 1;
    total: number = 0;

    date_from: any;
    date_to: any;

    search: string;

    pageMain: PageModel;
    pageItem: PageModel;
    pageGeneral: PageModel;

    get me(): UserModel {
        return this.authService.currentUser;
    }

    constructor(
        private checkScreenSizeService: CheckScreenSizeService,
        private modalService: ModalWindowService,
        private giveawayService: GiveawayService,
        private route: ActivatedRoute,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        // this.giveawayService.list().subscribe(() => {

        // })

        this.route.data.subscribe((data) => {
            this.pageMain = data.page;
            this.pageItem = data.page.giveawayItem;
        });

        this.route.parent.parent.parent.data.subscribe((data) => {
            this.pageGeneral = data.page;
        });

        this.filters(false, '', true);
    }

    openModal(data: { modalId: string; index?: number }) {
        this.selectedPartnerIndex = data.index;
        this.currentModalData.id = data.modalId;
        this.currentModalData.index = data.index;
        this.modalService.open(data.modalId);
    }

    closeModal(modalId: string, refresh?: boolean) {
        this.modalService.close(modalId);
        this.currentModalData.id = null;
        this.currentModalData.index = null;
        // if (refresh) {
        //     this.loadByFilters();
        // }
    }

    onPeriodChange([date_from, date_to]) {
        this.closeModal('modalDate');
        this.closeModal('modalPeriod');
        if (this.check !== 'all') {
            this.btnGreen = true;
        }

        if (date_from || date_to) {
            if (date_from) {
                this.date_from = date_from.utc().toDate();
            }

            if (date_to) {
                this.date_to = date_to.utc().toDate();
            }

            this.filters();
        }
    }

    onPerionSet(type: string) {
        switch (type) {
            case 'a':
                this.date_from = null;
                break;
            case 'w':
                this.date_from = moment()
                    .utc()
                    .startOf('week')
                    .startOf('day')
                    .toDate();
                break;
            case 'm':
                this.date_from = moment()
                    .utc()
                    .startOf('month')
                    .startOf('day')
                    .toDate();
                break;
            default:
        }

        this.filters();
    }

    // onPageChange() {
    //     this.page++;

    // }

    onSearch() {
        if (this.search.length > 2) {
            this.filters(false, this.search);
        }
    }

    filters(
        increment: boolean = false,
        search: string = '',
        init: boolean = false
    ) {
        if (increment) {
            this.page++;
        } else {
            this.page = 1;
        }

        const params = {
            order: { id: 'DESC' },
            filter: {},
            take: this.perPage,
            skip: (this.page - 1) * this.perPage,
        };

        if (this.date_from || this.date_to) {
            params.filter['endAt'] = {};

            if (this.date_from) {
                params.filter['endAt']['date1'] = this.date_from;
            }

            if (this.date_to) {
                params.filter['endAt']['date2'] = this.date_to;
            }
        }

        if (this.selectedDateFilter?.id) {
            params.filter['giveawayCategory'] = this.selectedDateFilter.id;
        }

        if (search) {
            params.filter['search'] = search;
        }

        if (init) {
            params['categoreies'] = true;
        }

        this.giveawayService.list(params).subscribe((response) => {
            if (increment) {
                response.items.forEach((element) => {
                    this.giveaways.push(element);
                });
            } else {
                this.giveaways = response.data.items;
            }

            this.total = response.count;

            if (init) {
                this.categories = response.categories;

                this.categories.unshift({
                    id: null,
                    title: 'Все категории',
                } as GiveawayCategoryModel);

                this.selectedDateFilter = this.categories[0];
            }
        });
    }
}
