import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HiddenMenuService } from 'src/app/core/services/hidden-menu.service';
import { ScrollService } from 'src/app/core/services/scroll.service';
import { PageModel } from 'src/app/data/models/page.models';

@Component({
    selector: 'app-fast-start',
    templateUrl: './fast-start.component.html',
    styleUrls: ['./fast-start.component.scss'],
})
export class FastStartComponent implements OnInit {
    @Input() page: PageModel;
    @Input() isSidebar: boolean;
    isMenuActive: boolean = false;
    constructor(
        public hiddenMenuService: HiddenMenuService,
        private router: Router,
        private scrollService: ScrollService
    ) {}

    ngOnInit(): void {}
    toggleMenu(menuName: string) {
        this.isMenuActive = this.hiddenMenuService.name === menuName;
        this.isMenuActive
            ? this.hiddenMenuService.close()
            : this.hiddenMenuService.open(menuName);
        this.isMenuActive = this.hiddenMenuService.name === menuName;

        this.hiddenMenuService.open('dashboard_navbar');
    }

    navigate(url: string) {
        this.hiddenMenuService.close();
        setTimeout(() => {
            this.router.navigateByUrl(url);
            this.scrollService.enableScroll = true;
        }, 300);
    }
}
