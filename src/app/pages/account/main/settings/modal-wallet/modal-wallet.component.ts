import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ApiForm } from 'src/app/core/abstract/api-from';
import { CryptoAddressValidator } from 'src/app/core/validators/crypto-address.validator';
import { PageModel } from 'src/app/data/models/page.models';
import { UserWalletModel } from 'src/app/data/models/user-wallet.model';
import { UserService } from 'src/app/data/services/user.service';
import { CodeInputComponent } from 'src/app/theme/components/code-input/code-input.component';
import { CoreService } from '../../../../../core/services/core.service';

@Component({
    selector: 'app-modal-wallet',
    templateUrl: './modal-wallet.component.html',
    styleUrls: ['./modal-wallet.component.scss'],
})
export class ModalWalletComponent extends ApiForm implements OnInit {
    trcWallet;
    ercWallet;

    isAddWallet: boolean = true;
    formGroup: FormGroup;
    formGroupCode: FormGroup;

    code: string;
    security: boolean;

    @ViewChild('codeInput') codeInput: CodeInputComponent;

    constructor(
        public coreService: CoreService,
        public userService: UserService,
        public fb: FormBuilder,
        private matDialogRef: MatDialogRef<ModalWalletComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            isAddWallet: boolean;
            itemData: any;
            page: PageModel;
            pageErrors: PageModel;
            wallets: UserWalletModel[];
            userWallet: UserWalletModel;
            googleEnabled: boolean;
        }
    ) {
        super(
            fb.group({
                1: fb.control('', [CryptoAddressValidator(1)]),
                2: fb.control('', [CryptoAddressValidator(2)]),
            }),
            false
        );

        this.reset = false;

        if (data?.wallets) {
            for (const wallet of data.wallets) {
                this.control(`${wallet.networkId}`).setValue(
                    wallet.shortAddress
                );
                this.control(`${wallet.networkId}`).clearValidators();
                this.control(`${wallet.networkId}`).disable();
                // this.control(`${wallet.networkId}`).setValidators([
                //     CryptoAddressValidator(+wallet.networkId, wallet.wallet),
                // ]);
                this.control(`${wallet.networkId}`).updateValueAndValidity();
                if (wallet.networkId === 2) {
                    this.trcWallet = wallet.wallet;
                }
                if (wallet.networkId === 1) {
                    this.ercWallet = wallet.wallet;
                }
            }

            this.observeErrors(this.formGroup);
        }
    }

    ngOnInit(): void {
        this.isAddWallet = this.data.isAddWallet;

        window.document
            .querySelector<any>('.modalTypeTwoBackdrop')
            .parentNode.classList.add('modal-type-two');
        this.matDialogRef.afterClosed().subscribe(() => {
            window.document
                .querySelector<any>('.cdk-overlay-container')
                .classList.remove('modal-type-two');
        });

        console.log(this.trcWallet);
        console.log(this.ercWallet);
    }

    prepareRequest(): Observable<any> {
        const userWallets = this.prepareData();

        if (!userWallets.length) {
            return null;
        }

        if (this.data.googleEnabled && !this.code) {
            this.security = true;
            return null;
        }

        const data = { userWallets: userWallets };

        if (this.code) {
            data['code'] = this.code;
        }

        return this.userService.update(data);
    }

    onRequestSuccess(value: any): void {
        this.matDialogRef.close({ userWallets: value.userWallets });
    }

    onRequestFailed(errorResponse: HttpErrorResponse): void {
        this.onFail(errorResponse);
    }

    onFail(errorResponse: HttpErrorResponse): void {
        this.btnSubmitted = true;

        if (errorResponse?.error?.message === 'wrongCode') {
            this.codeInput.wrongCode = true;
        }

        if (errorResponse?.error?.message?.includes('walletExist')) {
            if (errorResponse?.error?.message.includes('0x')) {
                this.control('1').setErrors({ walletExist: true });
            } else {
                this.control('2').setErrors({ walletExist: true });
            }

            this.syncErrors();
        }
    }

    modalClose() {
        this.matDialogRef.close();
    }

    prepareData() {
        const data = this.formGroup.getRawValue();
        const wallets = [];

        Object.keys(data).forEach((key) => {
            let wallet: any = this.data.wallets.find(
                (itm) => +itm.networkId === +key
            );

            if (!wallet && data[key]?.length) {
                wallet = {
                    wallet: data[key],
                    networkId: +key,
                };
                if (wallet?.wallet) {
                    wallets.push(wallet);
                }
            }
        });

        return wallets;
    }

    deleteWallet() {
        if (this.data.googleEnabled && !this.code) {
            this.security = true;
            return;
        }

        const data = { userWallet: this.data.userWallet };

        if (this.code) {
            data['code'] = this.code;
        }

        this.userService.deleteWallet(data).subscribe(
            () => {
                this.matDialogRef.close({
                    userWalletId: this.data.userWallet.id,
                });
            },
            (errorResponse) => {
                if (errorResponse?.error?.message === 'wrongCode') {
                    this.codeInput.wrongCode = true;
                }
            }
        );
    }

    walletCheck() {
        if (this.data.googleEnabled) {
            const userWallets = this.prepareData();

            if (!userWallets.length) {
                return null;
            }

            const data = { userWallets: userWallets };

            this.userService.walletCheck(data).subscribe(
                (response) => {
                    if (response) {
                        this.submit();
                    }
                },
                (err) => {
                    this.onFail(err);
                }
            );
        } else {
            this.submit();
        }
    }

    securityCheck() {
        this.codeInput.submit();
    }

    onCodeEnter(code: string) {
        this.code = code;

        if (this.data.isAddWallet) {
            this.submit();
        } else {
            this.deleteWallet();
        }
    }

    wallet(networkId: number): UserWalletModel {
        return this.data.wallets.find((itm) => itm.networkId == networkId);
    }
}
