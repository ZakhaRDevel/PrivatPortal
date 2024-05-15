import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TransactionType } from 'src/app/core/enums/transaction-type.enum';
import { HiddenMenuService } from 'src/app/core/services/hidden-menu.service';
import { ScrollService } from 'src/app/core/services/scroll.service';
import { PageModel } from 'src/app/data/models/page.models';
import { TransactionModel } from 'src/app/data/models/transaction.model';
import { TransactionService } from 'src/app/data/services/transaction.service';
import { ModalTransactionDetailsComponent } from '../../modals/modal-transaction-details/modal-transaction-details.component';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
    isMenuActive: boolean = false;
    @Input() page: PageModel;
    @Input() isSidebar: boolean;
    txs: TransactionModel[] = [];
    TransactionType = TransactionType;
    constructor(
        public hiddenMenuService: HiddenMenuService,
        private router: Router,
        private scrollService: ScrollService,
        private matDialog: MatDialog,
        private transactionService: TransactionService
    ) {}

    ngOnInit(): void {
        this.loadTxs();
    }

    closeMenuSidebar() {
        this.hiddenMenuService.close();
    }

    dashboardRedirect(): void {
        this.hiddenMenuService.close();
        setTimeout(() => {
            this.router.navigate(['/acc/dashboard']);
            this.scrollService.enableScroll = true;
        }, 500);
    }

    toggleMenu(menuName: string): void {
        this.isMenuActive = this.hiddenMenuService.name === menuName;
        this.isMenuActive
            ? this.hiddenMenuService.close()
            : this.hiddenMenuService.open(menuName);
        this.isMenuActive = this.hiddenMenuService.name === menuName;
    }

    openDetails(item) {
        this.matDialog.open(ModalTransactionDetailsComponent, {
            data: { item: item, page: this.page },
            panelClass: 'modal_transaction_details',
        });
    }

    loadTxs() {
        this.transactionService
            .list({
                transactionTypes: [
                    TransactionType.NFT_RECEIVE,
                    TransactionType.NFT_TRANSFER,
                    TransactionType.GIVEAWAY_WIN,
                    TransactionType.REFERRAL_FEE,
                ],
            })
            .subscribe((data) => {
                this.txs = data;
            });
    }

    getSign(id) {
        if (
            id === this.TransactionType.NFT_RECEIVE ||
            id === this.TransactionType.GIVEAWAY_WIN ||
            id === this.TransactionType.REFERRAL_FEE
        ) {
            return '+';
        } else if (id === this.TransactionType.NFT_TRANSFER) {
            return '-';
        }
    }
}
