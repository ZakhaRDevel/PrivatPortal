import {
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageModel } from 'src/app/data/models/page.models';
import { UserModel } from 'src/app/data/models/user.model';
import { UserService } from 'src/app/data/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { LangService } from 'src/app/core/services/lang.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
    get accountUrl(): string {
        return '';
    }

    get me(): UserModel {
        return this.authService.currentUser;
    }
    get isEnLang(): boolean {
        return this.langService.lang === 'en' ? true : false;
    }
    user: UserModel;
    page: PageModel;

    showScrollBtn: boolean = false;

    @ViewChild('missionBlock') missionBlock: ElementRef;

    is_login: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private userService: UserService,
        private langService: LangService
    ) {
        this.is_login = this.authService.isSigned;
    }

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.user = this.authService.isSigned
                ? UserModel.fromJson({})
                : data.upliner;

            if (this.user.id && !this.authService.isSigned) {
                this.userService.setUpliner(this.user.uplineId);
            }

            this.page = data.page;
        });
    }

    logout() {
        this.authService.logout();
    }

    @HostListener('document:scroll', ['$event'])
    onViewportScroll($event) {
        const offsetTop =
            this.missionBlock.nativeElement.offsetTop - window.innerHeight;

        this.showScrollBtn = window.pageYOffset >= offsetTop;
    }
}
