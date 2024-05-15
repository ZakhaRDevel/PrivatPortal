import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HiddenMenuService } from 'src/app/core/services/hidden-menu.service';
import { AnnouncementModel } from 'src/app/data/models/announcement.model';
import { PageModel } from 'src/app/data/models/page.models';
import { AnnouncementService } from 'src/app/data/services/announcement.service';

@Component({
    selector: 'app-announcement-item',
    templateUrl: './announcement-item.component.html',
    styleUrls: ['./announcement-item.component.scss'],
})
export class AnnouncementItemComponent implements OnInit {
    announcements: AnnouncementModel[] = [];
    announcement: AnnouncementModel;

    pageMain: PageModel;

    get lastItem() {
        return this.announcementService.lastAnnouncements.lastItem;
    }

    get firstItem() {
        return this.announcementService.lastAnnouncements.firstItem;
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private announcementService: AnnouncementService
    ) {}

    ngOnInit(): void {
        this.route.parent.data.subscribe((data) => {
            this.pageMain = data.page;
        });
        this.route.data.subscribe((data) => {
            this.announcement = data.data.announcement;
            this.announcementService.lastAnnouncements.current =
                data.data.announcement;
        });
    }

    goToPrevAnnouncement() {
        this.announcementService.announcementChangeEvent.emit({
            direction: 'prev',
            slug: this.announcement.slug,
        });
    }

    goToNextAnnouncement() {
        this.announcementService.announcementChangeEvent.emit({
            direction: 'next',
            slug: this.announcement.slug,
        });
    }

    goBack() {
        this.router.navigateByUrl('/acc/announcements');
    }
}
