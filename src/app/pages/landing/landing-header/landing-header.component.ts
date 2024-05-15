import { Component, Input, OnInit } from '@angular/core';
import { HiddenMenuService } from 'src/app/core/services/hidden-menu.service';
import { SwipeService } from 'src/app/core/services/swipe.service';
import { PageModel } from 'src/app/data/models/page.models';
import { UserModel } from 'src/app/data/models/user.model';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-landing-header',
    templateUrl: './landing-header.component.html',
    styleUrls: ['./landing-header.component.scss'],
})
export class LandingHeaderComponent implements OnInit {
    @Input() user: UserModel;
    @Input() page: PageModel;

    activeLink: boolean = false;

    is_login: boolean = false;

    get registerLink(): string {
        return this.user?.id ? `/register?u=${this.user.uplineId}` : '';
    }

    get loginLink(): string {
        return this.user?.id ? `/acc?u=${this.user.uplineId}` : '';
    }

    get showSocials(): boolean {
        if (!this.user.id) {
            return false;
        }

        const socials = [
            'Twitter',
            'Instagram',
            'Facebook',
            'LinkedIn',
            'Tiktok',
        ];

        let show = false;

        socials.forEach((itm) => {
            if (
                this.user.userDetail[`${itm.toLowerCase()}Url`] &&
                !this.user.userDetail[`hide${itm}`]
            ) {
                show = true;
            }
        });

        return show;
    }

    constructor(
        public hiddenMenuService: HiddenMenuService,
        private swipeService: SwipeService,
        private authService: AuthService
    ) {
        this.is_login = this.authService.isSigned;
    }

    ngOnInit(): void {
        this.swipeService.isSwipeChange.subscribe(() => {
            if (
                this.swipeService.swipeSide == 'right' &&
                this.hiddenMenuService.name === 'menu_contact'
            ) {
                this.closeMenuContact();
            }
        });

        console.log(this.showSocials);
    }

    openMenuContact() {
        this.hiddenMenuService.open('menu_contact');
    }

    closeMenuContact() {
        this.hiddenMenuService.close();
    }

    swipe(e, v) {}

    logout() {
        this.authService.logout();
    }
}
