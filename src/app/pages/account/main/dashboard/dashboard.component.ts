import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ClipboardService } from 'ngx-clipboard';
import { AuthService } from 'src/app/core/services/auth.service';
import { HiddenMenuService } from 'src/app/core/services/hidden-menu.service';
import { ScrollService } from 'src/app/core/services/scroll.service';
import { PageModel } from 'src/app/data/models/page.models';
import { TransactionModel } from 'src/app/data/models/transaction.model';
import { UserModel } from 'src/app/data/models/user.model';
import { UserService } from 'src/app/data/services/user.service';
import { ModalNftTransferComponent } from 'src/app/theme/modals/modal-nft-transfer/modal-nft-transfer.component';

interface IStatistic {
    affiliate: {
        partners: number;
        giveaway: string;
        account: number;
    };
    nft: {
        sum: number;
        total: number;
    };
}

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
    @ViewChild('transactions') transactions: ElementRef;
    private isMenuActive: boolean = false;
    isCopiedActive: boolean;
    isNameLong: boolean = false;
    shortName: string;
    isRefDropdownActive: boolean = false;

    page: PageModel;
    pageNft: PageModel;
    pageGeneral: PageModel;

    statistic: IStatistic;

    transactionsData: TransactionModel[] = [];

    get me(): UserModel {
        return this.authService.currentUser;
    }

    get link(): string {
        return `${window.location.origin}/${
            this.me.nickname ? this.me.nickname : this.me.uplineId
        }`;
    }

    constructor(
        public hiddenMenuService: HiddenMenuService,
        private matDialog: MatDialog,
        private _clipboardService: ClipboardService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private scrollService: ScrollService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.hiddenMenuService.close();
        this.route.data.subscribe((data) => {
            this.page = data.page;
            this.pageNft = data.page.nft;
        });
        this.route.parent.data.subscribe((data) => {
            this.pageGeneral = data.page;
        });
        this.userService.home().subscribe((data) => {
            this.statistic = data;
            this.statistic.affiliate.giveaway = this.statistic.affiliate
                .giveaway
                ? moment(this.statistic.affiliate.giveaway)
                      .local()
                      .format('YYYY-MM-DD')
                : '—';
            console.log(this.statistic.affiliate.giveaway);
            this.transactionsData = data.transactions;
        });
    }

    ngAfterViewInit() {
        this.setNamePopup();
        this.scrollToTransactions();
    }

    toggleMenu(menuName: string) {
        this.isMenuActive = this.hiddenMenuService.name === menuName;
        this.isMenuActive
            ? this.hiddenMenuService.close()
            : this.hiddenMenuService.open(menuName);
        this.isMenuActive = this.hiddenMenuService.name === menuName;

        this.hiddenMenuService.open('dashboard_navbar');
    }

    copyHandler(text): void {
        this.isCopiedActive = true;
        this._clipboardService.copy(text);
        setTimeout(() => (this.isCopiedActive = false), 2000);
    }

    copyString(text: string) {
        this._clipboardService.copy(text);
        this.isCopiedActive = true;
        this.isRefDropdownActive = false;
        setTimeout(() => (this.isCopiedActive = false), 2000);
    }

    setNamePopup() {
        const block = document.getElementById('account-name');
        const text = block.getElementsByClassName('text')[0];

        text?.clientWidth > block?.clientWidth
            ? (this.isNameLong = true)
            : (this.isNameLong = false);
    }

    toggleRefDropdown(state: boolean): void {
        if (this.isCopiedActive) {
            this.isCopiedActive = !state;
            this.isRefDropdownActive = state;
        } else {
            this.isRefDropdownActive = state;
        }
    }

    openTransfer() {
        this.matDialog.open(ModalNftTransferComponent, {
            data: { page: this.pageNft },
        });
    }

    scrollToTransactions() {
        setTimeout(() => {
            if (this.scrollService.enableScroll && innerWidth < 1440) {
                scrollTo(0, this.transactions.nativeElement.offsetTop - 10);
                this.scrollService.enableScroll = false;
            } else if (this.scrollService.enableScroll) {
                scrollTo(0, this.transactions.nativeElement.offsetTop);
                this.scrollService.enableScroll = false;
            }
        }, 500);
    }

    navigate(
        url: string,
        scroll: boolean = false,
        participate: boolean = false
    ) {
        setTimeout(() => {
            this.router.navigateByUrl(url);
            if (scroll) {
                this.scrollService.enableScroll = true;
            }
            if (participate) {
                this.scrollService.participate = true;
            }
        }, 300);
    }
}
