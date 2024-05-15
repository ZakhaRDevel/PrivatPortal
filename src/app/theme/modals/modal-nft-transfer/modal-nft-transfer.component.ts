import { HttpErrorResponse } from '@angular/common/http';
import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiForm } from 'src/app/core/abstract/api-from';
import { AuthService } from 'src/app/core/services/auth.service';
import { ScrollService } from 'src/app/core/services/scroll.service';
import { allRequiredValidator } from 'src/app/core/validators/all-required.validator';
import { PageModel } from 'src/app/data/models/page.models';
import { UserNftModel } from 'src/app/data/models/user-nft.model';
import { NftService } from 'src/app/data/services/nft.service';

@Component({
    selector: 'app-modal-nft-transfer',
    templateUrl: './modal-nft-transfer.component.html',
    styleUrls: ['./modal-nft-transfer.component.scss'],
})
export class ModalNftTransferComponent extends ApiForm implements OnInit {
    isClosing: boolean = false;

    states = {
        settingsRedirect: {
            value: 'settingsRedirect',
            title: 'titleTransfer',
        },
        transferForm: { value: 'transferForm', title: 'titleTransfer' },
        authCheck: { value: 'authCheck', title: 'title2fa' },
        orderCompleted: {
            value: 'orderCompleted',
            title: 'titleSuccess',
        },
    };

    activeState: { value: string; title: string } =
        this.states.settingsRedirect;

    formGroup: FormGroup;
    isCopyPaste: boolean;

    wallet: string = '';

    userNfts: UserNftModel[] = [];
    selectedUserNft: UserNftModel;

    wrongCode: boolean;

    isTyping: boolean;

    @ViewChild('number0') number0: ElementRef;
    @ViewChild('number1') number1: ElementRef;
    @ViewChild('number2') number2: ElementRef;
    @ViewChild('number3') number3: ElementRef;
    @ViewChild('number4') number4: ElementRef;
    @ViewChild('number5') number5: ElementRef;

    get me() {
        return this.authService.currentUser;
    }

    get googleFb(): FormGroup {
        return this.formGroup.get('numberCode') as FormGroup;
    }

    get shortWallet(): string {
        return this.wallet
            ? `${this.wallet.slice(0, 5)}...${this.wallet.slice(
                  this.wallet.length - 5,
                  this.wallet.length
              )}`
            : '';
    }

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private nftService: NftService,
        private router: Router,
        private scrollService: ScrollService,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            trigger: ElementRef;
            page: PageModel;
            pageErrors: PageModel;
            selectedUserNftId: number;
        },
        private matDialogRef: MatDialogRef<ModalNftTransferComponent>
    ) {
        super(
            fb.group({
                numberCode: fb.group({}),
                userNftId: fb.control(null, Validators.required),
            }),
            false
        );
        if (this.me.userWallets.length) {
            const wallet = this.me.userWallets.find(
                (itm) => itm.networkId == 1
            );

            if (wallet) {
                this.wallet = wallet.wallet;
            }

            this.nftService.list().subscribe((res) => {
                this.userNfts = res.filter((itm) => !itm.isTransfered);

                let item = this.userNfts.find(
                    (itm) => itm.id === this.data?.selectedUserNftId
                );

                if (!item) {
                    item = this.userNfts[0];
                }

                if (item) {
                    this.control('userNftId').setValue(item.id);
                    this.onNftChange(item.id);
                }
            });
        }

        this.activeState = this.wallet
            ? this.states.transferForm
            : this.states.settingsRedirect;
    }

    ngOnInit(): void {
        document
            .getElementsByClassName('cdk-overlay-container')[0]
            .classList.add('tall');
        this.matDialogRef.afterClosed().subscribe(() => {
            document
                .getElementsByClassName('cdk-overlay-container')[0]
                .classList.remove('tall');
        });
    }

    closeDialog(navigate = false) {
        this.isClosing = true;
        setTimeout(() => {
            this.matDialogRef.close({
                nftId: this.data.selectedUserNftId,
                completedTransfer: this.activeState.value === 'orderCompleted',
            });

            if (navigate) {
                this.router.navigateByUrl('/acc/settings');
                this.scrollService.enableScroll = true;
                this.scrollService.openModalWallet = true;
            }
        }, 300);
    }

    prepareRequest(): Observable<any> {
        const data = this.formGroup.getRawValue();

        if (this.me.userSecurity.googleEnabled) {
            let code = '';
            Object.values(data.numberCode).forEach((val) => {
                code += val;
            });
            data['code'] = code;
        } else {
            delete data.numberCode;
        }

        return this.nftService.transfer(data);
    }

    onRequestSuccess(value: any): void {
        super.onRequestSuccess(value);
        this.activeState = this.states.orderCompleted;
    }

    beforeSubmit() {
        if (!this.selectedUserNft) {
            return;
        }

        if (this.me.userSecurity.googleEnabled) {
            this.googleFb.addControl('number0', this.fb.control(null, []));
            this.googleFb.addControl('number1', this.fb.control(null, []));
            this.googleFb.addControl('number2', this.fb.control(null, []));
            this.googleFb.addControl('number3', this.fb.control(null, []));
            this.googleFb.addControl('number4', this.fb.control(null, []));
            this.googleFb.addControl('number5', this.fb.control(null, []));

            this.googleFb.addValidators(allRequiredValidator(this.googleFb));

            this.googleFb.valueChanges.subscribe((val) => {
                setTimeout(() => {
                    this.handleCodeChange(val);
                }, 100);

                this.wrongCode = false;
                this.clearError(this.control('numberCode'));
            });

            this.activeState = this.states.authCheck;
            setTimeout(() => {
                this.number0.nativeElement.focus();
            }, 300);
        } else {
            this.submit();
        }
    }

    handleDelete(evt: any, el) {
        const key = evt.keyCode || evt.charCode;
        if (key == 8 || key == 46) {
            if (this.googleFb.get('number' + el).value) {
                this.googleFb.get('number' + el).setValue(null);
            } else if (this.googleFb.get('number' + el) && el > 0) {
                this.googleFb.get('number' + (el - 1)).setValue(null);
            }
        }
    }

    onFocus(el) {
        if (el.value) {
            el.focus();
        } else {
            if (!this.googleFb.get('number0').value) {
                this.number0.nativeElement.focus();
            } else if (!this.googleFb.get('number1').value) {
                this.number1.nativeElement.focus();
            } else if (!this.googleFb.get('number2').value) {
                this.number2.nativeElement.focus();
            } else if (!this.googleFb.get('number3').value) {
                this.number3.nativeElement.focus();
            } else if (!this.googleFb.get('number4').value) {
                this.number4.nativeElement.focus();
            } else if (!this.googleFb.get('number5').value) {
                this.number5.nativeElement.focus();
            }
        }
    }

    theFieldsAreFloode = () => {
        return (
            this.googleFb.get('number5').value &&
            this.googleFb.get('number4').value &&
            this.googleFb.get('number3').value &&
            this.googleFb.get('number2').value &&
            this.googleFb.get('number1').value &&
            this.googleFb.get('number0').value
        );
    };

    onInputSubmit() {
        if (this.theFieldsAreFloode()) {
            this.submit();
        }
    }

    handleCodeChange(val: any) {
        let next = null;
        this.isTyping = true;
        Object.keys(val).forEach((key) => {
            if (!val[key] && !next) {
                next = key;
            }
        });

        if (next && !this.isCopyPaste && this[next]) {
            setTimeout(() => {
                this[next].nativeElement.focus();
                next = null;
                this.isTyping = false;
            }, 0);
        }

        setTimeout(() => {
            this.isTyping = false;
        }, 100);
    }

    onPaste(evt: any, group: string) {
        this.isCopyPaste = true;
        const clipboardData = evt.clipboardData || (<any>window).clipboardData;
        let pastedText = clipboardData.getData('text');

        if (pastedText && +pastedText > 0) {
            pastedText = pastedText.toString();

            for (let i = 0; i < pastedText.length; i++) {
                this.formGroup
                    .get(group)
                    .get(`${group}${i}`)
                    .setValue(pastedText.charAt(i), { emitEvent: false });
            }

            this.isCopyPaste = false;
        }
    }

    onNftChange(id: number) {
        if (id) {
            this.selectedUserNft = this.userNfts.find((itm) => itm.id == id);
        }
    }

    onRequestFailed(errorResponse: HttpErrorResponse): void {
        if (errorResponse?.error?.message === 'wrongCode') {
            this.wrongCode = true;
        }
    }
}
