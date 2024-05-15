import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HiddenMenuService } from 'src/app/core/services/hidden-menu.service';
import { AnnouncementModel } from 'src/app/data/models/announcement.model';
import { PageModel } from 'src/app/data/models/page.models';
import { AnnouncementService } from 'src/app/data/services/announcement.service';

@Component({
    selector: 'app-announcement',
    templateUrl: './announcement.component.html',
    styleUrls: ['./announcement.component.scss'],
})
export class AnnouncementComponent implements OnInit {
    announcements: AnnouncementModel[] = [];

    page: PageModel;

    search: string = '';

    perPage = 1;
    totalItems: number = 0;
    currentPage = 1;

    get title() {
        return this.router.url !== '/acc/announcements' ? 'title1' : 'title2';
    }

    get isArchive(): boolean {
        return this.router.url === '/acc/announcements';
    }

    get current() {
        return this.announcementService.lastAnnouncements.current;
    }

    constructor(
        private announcementService: AnnouncementService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.announcementService.announcementChangeEvent.subscribe((data) => {
            const index = this.announcements.findIndex(
                (itm) => itm.slug === data.slug
            );

            this.announcementService.lastAnnouncements.lastItem = false;

            if (index === -1) {
                this.goToAnnouncement(this.announcements[0].slug);
                return;
            }

            if (data.direction === 'next') {
                if (index + 2 === this.totalItems) {
                    this.announcementService.lastAnnouncements.lastItem = true;
                }

                if (this.announcements[index + 1]) {
                    this.goToAnnouncement(this.announcements[index + 1].slug);
                } else {
                    this.getAnnouncements();
                }
            }

            if (data.direction === 'prev') {
                this.goToAnnouncement(this.announcements[index - 1].slug);

                if (index >= 10) {
                    this.announcements.pop();
                    this.currentPage -= 1;
                }
            }
        });
    }

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.page = data.page;
        });
        this.getAnnouncements(true);
    }

    onSearch() {
        if (this.search.length > 2) {
            if (this.router.url !== '/acc/announcements') {
                this.router.navigateByUrl('/acc/announcements').then(() => {
                    setTimeout(() => {
                        this.announcementService.searchEvent.emit(this.search);
                    }, 1000);
                });
            } else {
                this.announcementService.searchEvent.emit(this.search);
            }
        }
    }

    goBack() {
        this.router.navigateByUrl('/acc/announcements');
    }

    goToAnnouncement(id: string) {
        const index = this.announcements.findIndex((itm) => itm.slug === id);
        let totalItems = this.announcementService.lastAnnouncements.total;
        if (index + 1 === totalItems) {
            this.announcementService.lastAnnouncements.lastItem = true;
        } else {
            this.announcementService.lastAnnouncements.lastItem = false;
        }
        this.router.navigate(['/acc/announcements/', id]);
    }

    getAnnouncements(isInit: boolean = false) {
        const params = {
            order: { id: 'DESC' },
            filter: {},
            take: isInit ? 10 : 1,
            skip: isInit ? 0 : (this.currentPage - 1) * this.perPage + 10,
        };

        this.announcementService.list(params).subscribe((response) => {
            this.totalItems = response.count;

            if (isInit) {
                this.announcements = response.items;
                this.announcementService.lastAnnouncements.firstItem =
                    this.announcements[0].slug;

                this.announcementService.lastAnnouncements.total =
                    this.totalItems;
            } else {
                const item = response.items[0];

                if (item) {
                    this.announcements.push(item);
                    this.currentPage += 1;
                    this.goToAnnouncement(item.slug);
                }
            }
        });
    }
}
