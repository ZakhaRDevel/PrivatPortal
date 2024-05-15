import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ModalWindowService } from 'src/app/theme/modals/modal-window/modal-window.service';
import { AnnouncementModel } from 'src/app/data/models/announcement.model';
import { AnnouncementService } from 'src/app/data/services/announcement.service';
import { MatDialog } from '@angular/material/dialog';
import { CheckScreenSizeService } from 'src/app/core/services/check-screen-size.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementCategoryModel } from 'src/app/data/models/announcement-category.model';
import { PageModel } from 'src/app/data/models/page.models';
import { UserModel } from 'src/app/data/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-announcement-archive',
    templateUrl: './announcement-archive.component.html',
    styleUrls: ['./announcement-archive.component.scss'],
})
export class AnnouncementArchiveComponent implements OnInit {
    isClosing: boolean = false;
    announcements: AnnouncementModel[] = [];
    categories: AnnouncementCategoryModel[] = [];
    selectedDateFilter: AnnouncementCategoryModel;
    datePickerUsed: boolean;
    date_from: any = null;
    date_to: any;
    isDateFilter: boolean = false;
    selectedPartnerIndex: number;
    currentModalData = { id: null, index: null };
    typeTwo = true;

    get isMobile(): boolean {
        return innerWidth <= 1024 ? true : false;
    }
    get me(): UserModel {
        return this.authService.currentUser;
    }

    btnGreen = false;
    check;
    perPage: number = 10;

    page: number = 1;

    total: number = 0;

    pageMain: PageModel;
    pageGeneral: PageModel;

    constructor(
        private announcementService: AnnouncementService,
        private modalService: ModalWindowService,
        private matDialog: MatDialog,
        private checkScreenSizeService: CheckScreenSizeService,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService
    ) {
        this.announcementService.searchEvent.subscribe((search: string) => {
            this.filter(false, search);
        });
    }

    ngOnInit(): void {
        // this.announcementService.published().subscribe({
        //     next: (response) => {
        //         this.announcements = response;
        //     },
        // });

        this.route.parent.data.subscribe((data) => {
            this.pageMain = data.page;
        });

        this.route.parent.parent.parent.data.subscribe((data) => {
            this.pageGeneral = data.page;
        });

        this.filter(false, null, true);
    }
    openModalDataFilter() {
        this.isDateFilter = true;
    }
    closeModalDataFilter() {
        this.isDateFilter = false;
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
        this.date_from = date_from;
        this.date_to = date_to;
        this.datePickerUsed = true;
        this.selectedDateFilter = null;
        this.filter();
        this.closeModal('modalDate');
        this.closeModal('modalDate');

        // if (date_from || date_to) {
        //     if (date_from) {
        //         this.date_from = date_from.utc().toDate();
        //     }

        //     if (date_to) {
        //         this.date_to = date_to.utc().toDate();
        //     }

        //     this.filter();
        // }
    }

    goToAnnouncementItem(id) {
        const index = this.announcements.findIndex((itm) => itm.slug === id);
        let totalItems = this.announcementService.lastAnnouncements.total;
        if (index + 1 === totalItems) {
            this.announcementService.lastAnnouncements.lastItem = true;
        } else {
            this.announcementService.lastAnnouncements.lastItem = false;
        }
        this.router.navigate(['/acc/announcements/', id]);
    }

    onPerionSet(type: string) {
        switch (type) {
            case 'a':
                this.date_from = null;
                this.date_to = null;
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

        this.filter();

        if (this.isMobile) {
            this.closeModal('modalPeriod');
        }
    }

    filter(
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
            params.filter['publishedAt'] = {};

            if (this.date_from) {
                params.filter['publishedAt']['date1'] = this.date_from;
            }

            if (this.date_to) {
                params.filter['publishedAt']['date2'] = this.date_to;
            }
        }

        if (this.selectedDateFilter?.id) {
            params.filter['announcementCategory'] = this.selectedDateFilter.id;
        }

        if (search) {
            params.filter['search'] = search;
        }

        if (init) {
            params['categoreies'] = true;
        }

        this.announcementService.list(params).subscribe((response) => {
            if (increment) {
                response.items.forEach((element) => {
                    this.announcements.push(element);
                });
            } else {
                this.announcements = response.items;
            }

            this.total = response.count;

            if (init) {
                this.categories = response.categories;

                this.categories.unshift({
                    id: null,
                    title: 'allItems',
                } as AnnouncementCategoryModel);

                this.selectedDateFilter = this.categories[0];
            }
        });
    }
}
