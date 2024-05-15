import {
    Component,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { HiddenMenuService } from '../../../core/services/hidden-menu.service';
import { SwipeService } from '../../../core/services/swipe.service';
import { CheckScreenSizeService } from 'src/app/core/services/check-screen-size.service';
import { environment } from '../../../../environments/environment';
import { UserModel } from 'src/app/data/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { PageModel } from 'src/app/data/models/page.models';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    isMenuActive: boolean = false;
    hideMenu: boolean = false;

    @Input() page: PageModel;
    @ViewChild('mainHeader') mainHeader: ElementRef;

    get me(): UserModel {
        return this.authService.currentUser;
    }

    get homeLink(): string {
        return `/`;
        // return `/${this.me.uplineId}`;
    }

    isLongUserName: boolean = false;

    isOpenDropdown: boolean = false;

    constructor(
        public hiddenMenuService: HiddenMenuService,
        private swipeService: SwipeService,
        private checkScreenSizeService: CheckScreenSizeService,
        private authService: AuthService,
        private router: Router,
        private matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.swipeService.isSwipeChange.subscribe(() => {
            if (
                this.swipeService.swipeSide == 'up' &&
                this.hiddenMenuService.name === 'user_menu'
            ) {
                this.hiddenMenuService.close();
            }
        });

        // this.getResponsiveUserName(this.me.userDetail.fullName);
    }

    toggleMenu(menuName: string) {
        this.isMenuActive = this.hiddenMenuService.name === menuName;

        if (this.isMenuActive) {
            this.hiddenMenuService.close();
            this.mainHeader.nativeElement.style.paddingRight = '0';
        } else {
            this.hiddenMenuService.open(menuName);
            this.mainHeader.nativeElement.style.paddingRight =
                this.hiddenMenuService.getScrollbarWidth() + 'px';
        }
        this.isMenuActive = this.hiddenMenuService.name === menuName;
    }

    toggleSubMenu(name: string) {
        this.hiddenMenuService.subMenuName === name
            ? this.hiddenMenuService.closeSubMenu()
            : this.hiddenMenuService.openSubMenu(name);
    }

    preventClick(e: Event): void {
        e.stopPropagation();
    }

    toggleUseMenu() {
        let width = window.innerWidth;

        if (width <= 1024) {
            this.hiddenMenuService.name === 'user_menu'
                ? this.hiddenMenuService.close()
                : this.hiddenMenuService.open('user_menu');
        }
    }

    getResponsiveUserName(name) {
        let userBlockWidth = document
            .querySelector('#header_btn_user')
            .querySelector('.btn-user__name').clientWidth;

        let userNameWidth = document
            .querySelector('#header_btn_user')
            .querySelector('.btn-user__name')
            .querySelector('.name-full');
        let userNameShort = document
            .querySelector('#header_btn_user')
            .querySelector('.btn-user__name')
            .querySelector('.name-short') as any;

        if (userNameWidth.clientWidth > userBlockWidth) {
            this.isLongUserName = true;
            userNameShort.style.width = userBlockWidth + 'px';
        } else {
            this.isLongUserName = false;
            userNameShort.style.width = '100%';
        }

        return name;
    }

    logout() {
        this.authService.logout();
    }

    goToSettings() {
        let width = window.innerWidth;
        this.router.navigateByUrl('acc/settings');
        if (width <= 1024) {
            this.hiddenMenuService.close();
        } else {
            this.hideMenu = true;
        }
    }

    closeAllDialog() {
        this.matDialog.closeAll();
    }

    // @HostListener('document:click', ['$event'])
    // clickout(event) {
    //     if (
    //         event.target !== this.iconStatus.nativeElement &&
    //         event.target !== this.dropdownStatus.nativeElement
    //     ) {
    //         this.isOpenDropdown = false;
    //     }
    // }
}
