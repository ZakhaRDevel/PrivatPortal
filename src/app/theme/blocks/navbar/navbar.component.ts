import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { HiddenMenuService } from 'src/app/core/services/hidden-menu.service';
import { PageModel } from 'src/app/data/models/page.models';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    isMenuActive: boolean = false;
    isNewAnnounce: boolean = true;
    @Input() page: PageModel;

    get me() {
        return this.authService.currentUser;
    }

    get isGiveaways(): boolean {
        return this.router.url === '/acc/activities';
    }

    constructor(
        public hiddenMenuService: HiddenMenuService,
        private authService: AuthService,
        private matDialog: MatDialog,
        private router: Router
    ) {}

    ngOnInit(): void {}

    toggleMenu(menuName: string) {
        this.isMenuActive = this.hiddenMenuService.name === menuName;
        this.isMenuActive
            ? this.hiddenMenuService.close()
            : this.hiddenMenuService.open(menuName);
        this.isMenuActive = this.hiddenMenuService.name === menuName;
    }

    closeAllDialog() {
        setTimeout(() => {
            this.hiddenMenuService.close();
            this.matDialog.closeAll();
        }, 200);
    }
}
