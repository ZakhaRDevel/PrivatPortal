import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    ActivatedRoute,
    NavigationEnd,
    NavigationStart,
    Router,
} from '@angular/router';
import { filter, startWith, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ScrollService } from 'src/app/core/services/scroll.service';
import { PageModel } from 'src/app/data/models/page.models';
import { UserModel } from '../../../data/models/user.model';

@Component({
    selector: 'app-questionnare',
    templateUrl: './questionnare.component.html',
    styleUrls: ['./questionnare.component.scss'],
})
export class QuestionnareComponent implements OnInit, AfterViewInit, OnDestroy {
    is_onQuestionnareComponent: boolean = false;
    positionWindow: number = 0;
    @ViewChild('formWrapper') formWrapper: ElementRef;

    routerSub$: Subscription;
    page: PageModel;
    enableScroll = false;

    get step(): number {
        return +this.route.snapshot.firstChild.data['step'] || 1;
    }

    get me(): UserModel {
        return this.authService.currentUser;
    }

    get homeLink(): string {
        return `/`;
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private scrollService: ScrollService
    ) {}

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.page = data.page;
        });
    }

    ngAfterViewInit(): void {
        this.routerSub$ = this.router.events
            .pipe(
                filter((e) => e instanceof NavigationEnd),
                startWith(this.router)
            )
            .subscribe((event) => {
                if (this.scrollService.enableScroll) {
                    window.scrollTo(
                        0,
                        this.formWrapper.nativeElement.offsetTop - 1
                    );
                }
            });
    }

    ngOnDestroy(): void {
        this.routerSub$.unsubscribe();
    }

    logout() {
        this.authService.logout();
    }
}
