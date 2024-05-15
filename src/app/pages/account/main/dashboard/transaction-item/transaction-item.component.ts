import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageModel } from 'src/app/data/models/page.models';
import { TransactionModel } from 'src/app/data/models/transaction.model';
import { ModalTransactionDetailsComponent } from '../../../../../theme/modals/modal-transaction-details/modal-transaction-details.component';
import { TransactionType } from 'src/app/core/enums/transaction-type.enum';

@Component({
    selector: 'app-transaction-item',
    templateUrl: './transaction-item.component.html',
    styleUrls: ['./transaction-item.component.scss'],
})
export class TransactionItemComponent implements OnInit {
    @Input() data: TransactionModel;
    @Input() firstChild: boolean = false;
    @Input() lastChild: boolean = false;
    @Input() pageGeneral: PageModel;

    TransactionType = TransactionType;

    constructor(private matDialog: MatDialog) {}

    ngOnInit(): void {}

    openTransactionDialog(item: TransactionModel) {
        this.matDialog.open(ModalTransactionDetailsComponent, {
            data: { item: item, page: this.pageGeneral },
            panelClass: 'modal_transaction_details',
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
