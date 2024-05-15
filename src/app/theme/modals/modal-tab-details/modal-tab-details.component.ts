import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransactionModel } from 'src/app/data/models/transaction.model';
import { UserDetailModel } from 'src/app/data/models/user-detail.model';

@Component({
    selector: 'app-modal-tab-details',
    templateUrl: './modal-tab-details.component.html',
    styleUrls: ['./modal-tab-details.component.scss'],
})
export class ModalTabDetailsComponent implements OnInit {
    isClosing: boolean = false;
    constructor(
        private matDialogRef: MatDialogRef<ModalTabDetailsComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            refPage: boolean;
            title_1: string;
            title_2: string;
            title_3: string;
            title_4: string;
            title_5?: string;
            value_1: string;
            value_2: string;
            value_3: string;
            value_4: string;
            telegram: string;
            userTitle: string;
            userDetail: UserDetailModel;
            item: TransactionModel;
        }
    ) {}

    ngOnInit(): void {
    }
    closeDialog() {
        this.isClosing = true;
        setTimeout(() => this.matDialogRef.close(), 300);
    }
}
