import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiForm } from 'src/app/core/abstract/api-from';
import { AuthService } from 'src/app/core/services/auth.service';
import { ScrollService } from 'src/app/core/services/scroll.service';
import { minSumValidator } from 'src/app/core/validators/min-sum.validator';
import { PageModel } from 'src/app/data/models/page.models';
import { UserWalletModel } from 'src/app/data/models/user-wallet.model';
import { GiveawayService } from 'src/app/data/services/giveaway.service';

@Component({
    selector: 'app-modal-withdraw',
    templateUrl: './modal-withdraw.component.html',
    styleUrls: ['./modal-withdraw.component.scss'],
})
export class ModalWithdrawComponent extends ApiForm implements OnInit {
    isSuccessful: boolean = false;

    formGroup: FormGroup;
    get balance(): string {
        return (+this.data.balance).toFixed(2);
    }
    get wallet() {
        return this.me.userWallets.find(
            (itm) => itm.id === this.control('walletId').value
        );
    }

    get me() {
        return this.authService.currentUser;
    }

    constructor(
        private matDialogRef: MatDialogRef<ModalWithdrawComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            balance: number;
            page: PageModel;
            pageErrors: PageModel;
        },
        private router: Router,
        private fb: FormBuilder,
        private authService: AuthService,
        private giveawayService: GiveawayService,
        private scrollService: ScrollService
    ) {
        super(
            fb.group({
                walletId: fb.control(null, Validators.required),
                amount: fb.control(null, Validators.required),
            }),
            false
        );

        this.reset = false;

        if (this.me.userWallets.length) {
            this.control('walletId').setValue(this.me.userWallets[0].id);
            this.control('amount').setValue(this.data.balance);
            this.control('amount').addValidators(minSumValidator(9.99));
        }
    }

    ngOnInit(): void {
        window.document
            .querySelector<any>('.modalTypeTwoBackdrop')
            .parentNode.classList.add('modal-type-two');
        this.matDialogRef.afterClosed().subscribe(() => {
            window.document
                .querySelector<any>('.cdk-overlay-container')
                .classList.remove('modal-type-two');
        });
    }

    prepareRequest(): Observable<any> {
        const data = this.formGroup.getRawValue();
        data.walletId = +data.walletId;
        data.amount = +data.amount;

        return this.giveawayService.withdraw(data);
    }

    onRequestSuccess(value: any): void {
        this.isSuccessful = true;
    }

    modalClose() {
        setTimeout(() => {
            if (this.isSuccessful) {
                this.matDialogRef.close(this.data.balance);
            } else {
                this.matDialogRef.close();
            }
        }, 300);
    }

    goToSettings() {
        this.scrollService.enableScroll = true;
        this.router.navigateByUrl('/acc/settings').then(() => {
            this.matDialogRef.close();
        });
    }
}
