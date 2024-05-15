import {
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { HiddenMenuService } from 'src/app/core/services/hidden-menu.service';
import { AnnouncementModel } from 'src/app/data/models/announcement.model';
import { PageModel } from 'src/app/data/models/page.models';
import { AnnouncementService } from 'src/app/data/services/announcement.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    get isMobile(): boolean {
        return innerWidth < 1024 ? true : false;
    }
    isMenuActive: boolean = false;
    @Input() page: PageModel;
    announcements: AnnouncementModel[] = [];

    constructor(
        public hiddenMenuService: HiddenMenuService,
        private announcementService: AnnouncementService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.hiddenMenuService.openEvent.subscribe(() => {
            this.onOpen();
        });
    }

    toggleMenu(menuName: string) {
        this.isMenuActive = this.hiddenMenuService.name === menuName;
        this.isMenuActive
            ? this.hiddenMenuService.close()
            : this.hiddenMenuService.open(menuName);
        this.isMenuActive = this.hiddenMenuService.name === menuName;

        this.onOpen();
    }

    toggleMobileMenu(menuName: string) {
        this.isMenuActive = this.hiddenMenuService.name === menuName;
        this.isMenuActive
            ? this.hiddenMenuService.close()
            : this.hiddenMenuService.open(menuName);
        this.isMenuActive = this.hiddenMenuService.name === menuName;

        this.hiddenMenuService.open('dashboard_navbar');

        this.onOpen();
    }

    onOpen() {
        if (this.hiddenMenuService.name === 'dashboard_sidebar') {
            const params = {
                order: { id: 'DESC' },
                filter: {},
                take: 10,
                skip: 0,
            };

            this.announcementService.list(params).subscribe({
                next: (response) => {
                    this.announcements = response.items;
                },
            });
        }
    }

    closeMenuSidebar() {
        this.hiddenMenuService.close();
    }
}
