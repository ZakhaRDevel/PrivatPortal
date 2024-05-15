import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiForm } from 'src/app/core/abstract/api-from';
import { ErrorAnimation } from 'src/app/core/animations/error.animation';
import { IHttpResponse } from 'src/app/core/interfaces/http-response.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { LangService } from 'src/app/core/services/lang.service';
import { PageModel } from 'src/app/data/models/page.models';
import { UserService } from 'src/app/data/services/user.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { ModalformstatusComponent } from '../modal-form-status/modal-form-status.component';
import { CoreService } from '../../../core/services/core.service';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['../auth.component.scss'],
    animations: [ErrorAnimation()],
})
export class RegistrationComponent extends ApiForm implements OnInit {
    icon: string = '!';
    formGroup: FormGroup;
    tultipDark: boolean = true;
    page: PageModel;
    pageErrors: PageModel;

    constructor(
        private fb: FormBuilder,
        private matDialog: MatDialog,
        private userService: UserService,
        private authService: AuthService,
        private langService: LangService,
        private route: ActivatedRoute,
        private router: Router,
        public coreService: CoreService
    ) {
        super(
            fb.group({
                email: fb.control('', {
                    validators: [Validators.required, Validators.email],
                }),
                uplinerId: fb.control('', {
                    validators: [Validators.required],
                }),
                locale: fb.control('en', {
                    validators: [Validators.required],
                }),
            })
        );
        this.reset = false;
        this.control('uplinerId').setValue(this.userService.upliner);
        this.control('uplinerId').disable();
    }

    ngOnInit(): void {
        this.handleVerification();
        this.route.data.subscribe((data) => {
            this.page = data.page;
            this.pageErrors = data.page.errors;
        });
    }

    prepareRequest(): Observable<IHttpResponse> {
        const data = this.formGroup.getRawValue();
        data.email = data.email.toLowerCase();
        data.uplinerId = +data.uplinerId.toLowerCase().replace('pc', '');
        data.locale = this.langService.lang;

        return this.authService.signup(data);
    }

    onRequestSuccess(value: IHttpResponse): void {
        this.openFormStatusDialog();
    }

    openFormStatusDialog() {
        const dialog = this.matDialog.open(ModalformstatusComponent, {
            backdropClass: 'form-dialog-backdrop',
            data: {
                email: this.control('email').value,
                locale: this.langService.lang,
                page: this.page,
            },
        });

        dialog.afterClosed().subscribe(() => {
            this.control('email').setValue('');
        });
    }

    handleVerification() {
        const token = this.route.snapshot.queryParams.token;

        if (token) {
            this.authService.confirmEmail({ token }).subscribe({
                next: (response) => {
                    if (response.success === true) {
                        if (response?.message?.length) {
                            this.router.navigateByUrl('/login');
                        } else {
                            this.openSuccessConfirmModal();
                        }
                    } else {
                        this.openFailedConfirmModal();
                    }
                },
                error: (error) => {
                    this.openFailedConfirmModal();
                },
            });
        }
    }

    openSuccessConfirmModal() {
        const dialog = this.matDialog.open(AuthModalComponent, {
            backdropClass: 'form-dialog-backdrop',
            panelClass: 'form-dialog-container',
            data: {
                title: this.page.data.modalSuccess.title,
                img_url: '/assets/img/pages/auth/success.png',
                btn_text: this.page.data.modalSuccess.btn,
                btn_link: '/login',
            },
        });

        dialog.afterClosed().subscribe(() => {
            this.router.navigateByUrl('/login');
        });

        this.userService.removeFromClicks(this.userService.upliner);
    }

    openFailedConfirmModal() {
        this.matDialog.open(AuthModalComponent, {
            backdropClass: 'form-dialog-backdrop',
            panelClass: 'form-dialog-container',
            data: {
                title: this.page.data.modalFailedConfirmation.title,
                text: this.page.data.modalFailedConfirmation.text,
                img_url: '/assets/img/pages/auth/error.png',
                btn_text: this.page.data.modalFailedConfirmation.btn,
            },
        });
    }
}
