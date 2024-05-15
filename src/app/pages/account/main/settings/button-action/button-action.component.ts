import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { ModalSecurityComponent } from '../../../questionnare/modal-security/modal-security.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditComponent } from '../modal-edit/modal-edit.component';
import { ModalGoogleComponent } from '../modal-google/modal-google.component';
import { ModalPasswordComponent } from '../modal-password/modal-password.component';
import { ModalWalletComponent } from '../modal-wallet/modal-wallet.component';
import { PageModel } from 'src/app/data/models/page.models';
import { UserWalletModel } from 'src/app/data/models/user-wallet.model';
import { ScrollService } from 'src/app/core/services/scroll.service';

@Component({
    selector: 'app-button-action',
    templateUrl: './button-action.component.html',
    styleUrls: ['./button-action.component.scss'],
})
export class ButtonActionComponent implements OnInit {
    @Input() id: string;
    @Input() data: any;
    @Input() itemName: string;
    @Input() controlName: string;
    @Input() controlValue: any;
    @Input() pageErrors: PageModel;
    @Input() page: PageModel;
    @Input() googleEnabled: boolean;
    @Input() validators: any[] = [];
    @Input() wallets: UserWalletModel[] = [];

    @Input() name: string;
    @Input() value: any;

    @Input() isBtnEdit: boolean = false;
    @Input() isBtnVisible: boolean = false;
    @Input() isBtnAdd: boolean = false;
    @Input() isBtnGoogle: boolean = false;
    @Input() isBtnPasswordChange: boolean = false;
    @Input() isBtnAddWallet: boolean = false;

    @Input() isShowUserData: boolean = true;

    @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
    @Output() onHide: EventEmitter<void> = new EventEmitter<void>();

    constructor(private matDialog: MatDialog) {}

    ngOnInit(): void {}

    clickShowData() {
        this.onHide.emit();
        // this.isShowUserData = !this.isShowUserData;
    }

    openSecurityDialog() {
        const dialog = this.matDialog.open(ModalEditComponent, {
            disableClose: false,
            autoFocus: false,
            panelClass: 'edit-dialog-container',
            data: {
                page: this.page,
                pageErrors: this.pageErrors,
            },
        });

        dialog.afterClosed().subscribe((val) => {
            if (val) {
                this.onSuccess.emit(val);
            }
        });
    }

    openModalEdit() {
        const dialog = this.matDialog.open(ModalEditComponent, {
            disableClose: false,
            autoFocus: false,
            backdropClass: 'modalTypeTwoBackdrop',
            panelClass: 'edit-dialog-container',

            data: {
                name: this.name,
                value: this.value,
                page: this.page,
                pageErrors: this.pageErrors,
            },
        });

        dialog.afterClosed().subscribe((val) => {
            if (val) {
                if (val.nickname) {
                    val.nickname = val.nickname.toLowerCase();
                }
                this.onSuccess.emit(val);
            }
        });
    }

    openModalGoogle() {
        const dialog = this.matDialog.open(ModalGoogleComponent, {
            disableClose: false,
            autoFocus: false,
            panelClass: 'google-dialog-container',
            backdropClass: 'modalTypeTwoBackdrop',
            data: {
                page: this.page,
                pageErrors: this.pageErrors,
            },
        });

        dialog.afterClosed().subscribe((val) => {
            if (val) {
                this.onSuccess.emit(val);
            }
        });
    }
    // openModalAddWallet() {
    //     const dialog = this.matDialog.open(ModalWalletComponent, {
    //         disableClose: false,
    //         autoFocus: false,
    //         panelClass: 'wallet-dialog-container',
    //         backdropClass: 'modalTypeTwoBackdrop',
    //         data: {
    //             isAddWallet: true,
    //             wallets: this.wallets,
    //             page: this.page,
    //             pageErrors: this.pageErrors,
    //             googleEnabled: this.googleEnabled,
    //         },
    //     });

    //     dialog.afterClosed().subscribe((val) => {
    //         if (val) {
    //             this.onSuccess.emit(val);
    //         }
    //     });
    // }
    openModalPassword() {
        this.matDialog.open(ModalPasswordComponent, {
            disableClose: false,
            autoFocus: false,
            panelClass: 'password-dialog-container',
            backdropClass: 'modalTypeTwoBackdrop',
            data: {
                page: this.page,
                pageErrors: this.pageErrors,
            },
        });
    }
}
