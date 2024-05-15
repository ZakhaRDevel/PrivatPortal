import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransactionType } from 'src/app/core/enums/transaction-type.enum';
import { PageModel } from 'src/app/data/models/page.models';
import { TransactionModel } from 'src/app/data/models/transaction.model';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-modal-transaction-details',
    templateUrl: './modal-transaction-details.component.html',
    styleUrls: ['./modal-transaction-details.component.scss'],
})
export class ModalTransactionDetailsComponent implements OnInit {
    private readonly _matDialogRef: MatDialogRef<ModalTransactionDetailsComponent>;
    private readonly triggerElementRef: ElementRef;

    isClosing: boolean = false;

    item: TransactionModel;

    TransactionType = TransactionType;

    env = environment;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            item: TransactionModel;
            trigger: ElementRef;
            page: PageModel;
        },
        private matDialogRef: MatDialogRef<ModalTransactionDetailsComponent>
    ) {
        this.item = data.item;
    }

    ngOnInit(): void {
        // this.item = this.data.item
    }

    closeDialog() {
        this.isClosing = true;
        setTimeout(() => this.matDialogRef.close(), 300);
    }
}
