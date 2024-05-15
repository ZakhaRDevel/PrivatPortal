import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { UserModel } from '../../../../data/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditComponent } from './modal-edit/modal-edit.component';
import { ModalGoogleComponent } from './modal-google/modal-google.component';
import { ModalPasswordComponent } from './modal-password/modal-password.component';
import { PageModel } from '../../../../data/models/page.models';
import { ModalWalletComponent } from './modal-wallet/modal-wallet.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { nicknameValidator } from 'src/app/core/validators/nickname.validator';
import { UserService } from 'src/app/data/services/user.service';
import { UserWalletModel } from 'src/app/data/models/user-wallet.model';
import { ModalGoogleProblemComponent } from './modal-google-problem/modal-google-problem.component';
import { ScrollService } from 'src/app/core/services/scroll.service';

@Component({
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, AfterViewInit {
    @ViewChild('secutity') secutity: ElementRef;
    page: PageModel;
    pageErrors: PageModel;

    is2fa: boolean = false;

    formGroup: FormGroup;

    get me(): UserModel {
        return this.authService.currentUser;
    }

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private matDialog: MatDialog,
        private fb: FormBuilder,
        private userService: UserService,
        private scrollService: ScrollService
    ) {
        // this.formGroup = fb.group({
        //     nickname: fb.control('', []),
        //     telegram: fb.control('', []),
        //     userDetail: fb.group({
        //         fullName: fb.control('', []),
        //         twitterUrl: fb.control('', []),
        //         facebookUrl: fb.control('', []),
        //         linkedinUrl: fb.control('', []),
        //         instagramUrl: fb.control('', []),
        //         tiktokUrl: fb.control('', []),
        //     }),
        // });
        // nicknameValidator()
    }

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.page = data.page;
            this.pageErrors = this.page['errors'];
        });
    }

    ngAfterViewInit() {
        if (this.scrollService.enableScroll) {
            this.scrollToSecurity();
        }
        if (
            this.scrollService.enableScroll &&
            this.scrollService.openModalWallet
        ) {
            this.scrollToSecurityAndOpenModalWallet();
        }
    }

    checkData(data) {
        return data?.length > 0 ? true : false;
    }

    active2Fa() {
        this.is2fa = true;
    }

    openModalRemoveWallet(wallet: UserWalletModel) {
        const dialog = this.matDialog.open(ModalWalletComponent, {
            disableClose: false,
            autoFocus: false,
            panelClass: 'remove-dialog-container',
            backdropClass: 'modalTypeTwoBackdrop',
            data: {
                isAddWallet: false,

                userWallet: wallet,
                googleEnabled: this.me.userSecurity.googleEnabled,
                page: this.page,
                pageErrors: this.pageErrors,

                // page: this.page,
            },
        });

        dialog.afterClosed().subscribe((val) => {
            if (val) {
                this.onSuccess(val);
            }
        });
    }

    onSuccess(val) {
        if (val?.userDetail) {
            this.authService.currentUser.userDetail = {
                ...this.authService.currentUser.userDetail,
                ...val.userDetail,
            };
        } else if (val?.userWallets) {
            this.authService.currentUser.userWallets =
                UserWalletModel.fromJsonArray(val.userWallets);
        } else if (val.userWalletId) {
            this.authService.currentUser.userWallets =
                this.authService.currentUser.userWallets.filter(
                    (itm) => itm.id != val.userWalletId
                );
        } else {
            this.authService.currentUser = {
                ...this.authService.currentUser,
                ...val,
            };
        }
    }

    onHide(key: string) {
        this.authService.currentUser.userDetail[key] = !this.me.userDetail[key];
        this.userService
            .update({
                userDetail: {
                    [key]: this.me.userDetail[key],
                },
            })
            .subscribe(() => {});
    }

    openModalGoogleProblem() {
        this.matDialog.open(ModalGoogleProblemComponent, {
            backdropClass: 'modalTypeTwoBackdrop',
            data: {
                page: this.page,
            },
        });
    }

    scrollToSecurity() {
        setTimeout(() => {
            scrollTo(0, this.secutity.nativeElement.offsetTop);
            this.scrollService.enableScroll = false;
        }, 300);
    }

    scrollToSecurityAndOpenModalWallet() {
        setTimeout(() => {
            scrollTo(0, this.secutity.nativeElement.offsetTop);
            this.openModalAddWallet();
            this.scrollService.enableScroll = false;
            this.scrollService.openModalWallet = false;
        }, 300);
    }

    shortAddress(url) {
        const REGEX = /(^\w+:|^)\/\//;
        return url ? url.replace(REGEX, '') : '';
    }

    openModalAddWallet() {
        const dialog = this.matDialog.open(ModalWalletComponent, {
            disableClose: false,
            autoFocus: false,
            panelClass: 'wallet-dialog-container',
            backdropClass: 'modalTypeTwoBackdrop',
            data: {
                isAddWallet: true,
                wallets: this.me.userWallets,
                page: this.page,
                pageErrors: this.pageErrors,
                googleEnabled: this.me.userSecurity.googleEnabled,
            },
        });

        dialog.afterClosed().subscribe((val) => {
            if (val) {
                this.onSuccess(val);
            }
        });
    }
}
