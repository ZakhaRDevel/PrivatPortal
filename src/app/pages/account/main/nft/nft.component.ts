import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionType } from 'src/app/core/enums/transaction-type.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { HiddenMenuService } from 'src/app/core/services/hidden-menu.service';
import { ScrollService } from 'src/app/core/services/scroll.service';
import { PageModel } from 'src/app/data/models/page.models';
import { TransactionModel } from 'src/app/data/models/transaction.model';
import { UserNftModel } from 'src/app/data/models/user-nft.model';
import { NftService } from 'src/app/data/services/nft.service';
import { TransactionService } from 'src/app/data/services/transaction.service';
import { ModalNftTransferComponent } from 'src/app/theme/modals/modal-nft-transfer/modal-nft-transfer.component';

@Component({
    templateUrl: './nft.component.html',
    styleUrls: ['./nft.component.scss'],
})
export class NftComponent implements OnInit, AfterViewInit {
    @ViewChild('content') content: ElementRef;
    isMenuActive: boolean = false;
    page: PageModel;
    pageErrors: PageModel;
    pageGeneral: PageModel;
    loading: boolean = false;
    userNfts: UserNftModel[] = [];

    nftSum = 0;

    txs: TransactionModel[] = [];

    get me() {
        return this.authService.currentUser;
    }

    constructor(
        public hiddenMenuService: HiddenMenuService,
        private matDialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private scrollService: ScrollService,
        private nftService: NftService,
        private authService: AuthService,
        private transactionService: TransactionService
    ) {}

    ngOnInit(): void {
        this.hiddenMenuService.close();
        this.route.data.subscribe((data) => {
            this.page = data.page;
            this.pageErrors = data.page.errors;
        });
        this.route.parent.data.subscribe((data) => {
            this.pageGeneral = data.page;
        });
        this.init();
    }
    ngAfterViewInit(): void {
        if (this.scrollService.enableScroll) {
            setTimeout(() => {
                this.scrollToElem(this.content.nativeElement, 50);
                this.scrollService.enableScroll = false;
            }, 500);
        }
    }

    init() {
        this.nftService.list().subscribe((res) => {
            this.nftSum = 0;
            res.forEach((itm) => {
                this.nftSum += +itm.nft.price;
            });

            this.userNfts = res;
            this.loading = true;
        });
    }

    openTxs() {
        this.toggleMenu('transactions_sidebar');
    }

    toggleMenu(menuName: string): void {
        this.isMenuActive = this.hiddenMenuService.name === menuName;
        this.isMenuActive
            ? this.hiddenMenuService.close()
            : this.hiddenMenuService.open(menuName);
        this.isMenuActive = this.hiddenMenuService.name === menuName;
    }

    // dashboardRedirect(): void {
    //     this.hiddenMenuService.close();
    //     setTimeout(() => {
    //         this.router.navigate(['/acc/dashboard']);
    //         this.scrollService.enableScroll = true;
    //     }, 300);
    // }

    // openDetails(item) {
    //     this.matDialog.open(ModalTransactionDetailsComponent, {
    //         data: { item: item, page: this.page },
    //         panelClass: 'modal_transaction_details',
    //     });
    // }

    openTransferModal(selectedUserNft: any) {
        let dialog = this.matDialog.open(ModalNftTransferComponent, {
            data: {
                selectedUserNftId: selectedUserNft.id,
                page: this.page,
                pageErrors: this.pageErrors,
            },
            panelClass: 'overflow',
            disableClose: true,
            autoFocus: false,
            maxHeight: '100vh',
        });
        dialog.afterClosed().subscribe((data) => {
            if (data.completedTransfer) {
                const index = this.userNfts.findIndex(
                    (itm) => itm.id === data.nftId
                );
                this.userNfts[index].isTransfered = true;
            }
        });
    }

    // closeMenuSidebar() {
    //     this.hiddenMenuService.close();
    // }

    async downloadImage(imageSrc) {
        const image = await fetch(imageSrc);
        const imageBlog = await image.blob();
        const imageURL = URL.createObjectURL(imageBlog);

        const link = document.createElement('a');
        link.href = imageURL;
        link.download = 'nft';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    scrollToElem(elem, offsetCorrect = 0) {
        let bodyRect = document.body.getBoundingClientRect();
        let elemRect = elem.getBoundingClientRect();
        let offset = elemRect.top - bodyRect.top;
        scrollTo(0, offset - offsetCorrect);
    }
}
