import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiForm } from 'src/app/core/abstract/api-from';
import { AuthService } from 'src/app/core/services/auth.service';
import { equalValidator } from 'src/app/core/validators/equal.validator';
import { passwordValidator } from 'src/app/core/validators/password.validator';
import { PageModel } from 'src/app/data/models/page.models';
import { AuthModalComponent } from 'src/app/pages/auth/auth-modal/auth-modal.component';
import { environment } from 'src/environments/environment';
import { CoreService } from '../../../core/services/core.service';

@Component({
    selector: 'app-recovery-step-two',
    templateUrl: './recovery-step-two.component.html',
    styleUrls: ['../auth.component.scss'],
})
export class RecoveryStepTwoComponent extends ApiForm implements OnInit {
    iconShowPassword = false;
    iconShowConfirmedPassword = false;
    page: PageModel;
    pageErrors: PageModel;

    constructor(
        private fb: FormBuilder,
        private matDialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        public coreService: CoreService
    ) {
        super(
            fb.group({
                password: fb.control('', {
                    validators: [Validators.required],
                }),
                confirmed_password: fb.control('', {
                    validators: [Validators.required],
                }),
                token: fb.control('', {
                    validators: [Validators.required],
                }),
            }),
            false
        );

        this.control('password').addValidators(passwordValidator());
        this.control('confirmed_password').addValidators(
            equalValidator(this.control('password'))
        );

        this.formGroup.valueChanges.subscribe(() => {
            this.prepareErrors();
        });

        this.control('password').valueChanges.subscribe(() => {
            this.control('confirmed_password').setValue(
                this.control('confirmed_password').value,
                { emitEvent: false }
            );
        });

        this.control('confirmed_password').valueChanges.subscribe(() => {
            this.control('password').setValue(this.control('password').value, {
                emitEvent: false,
            });
        });
    }

    ngOnInit(): void {
        this.handleRecoveryToken();
        this.route.data.subscribe((data) => {
            this.page = data.page;
            this.pageErrors = data.page.errors;
        });
    }

    prepareRequest(): Observable<any> {
        const data = this.formGroup.getRawValue();

        return this.authService.passwordReset(data);
    }

    onRequestSuccess(value: any): void {
        this.openSuccessConfirmModal();
    }

    handleRecoveryToken() {
        const token = this.route.snapshot.queryParams.token;

        if (token) {
            this.authService.confirmRecovery({ token }).subscribe({
                next: (response) => {
                    if (!response.success) {
                        this.openFailedConfirmModal();
                    } else {
                        this.control('token').setValue(token);
                    }
                },
                error: (error) => {
                    this.openFailedConfirmModal();
                },
            });
        }
    }

    onToggleIconPassword(field: string) {
        if (field === 'password') {
            this.iconShowPassword = !this.iconShowPassword;
        } else if (field === 'confirmed_password') {
            this.iconShowConfirmedPassword = !this.iconShowConfirmedPassword;
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
            this.router.navigateByUrl('login');
        });
    }

    openFailedConfirmModal() {
        // window.open(environment.api.landingUrl, '_self', 'noopener');
        this.router.navigateByUrl('/reset-password');
        this.matDialog.open(AuthModalComponent, {
            backdropClass: 'form-dialog-backdrop',
            panelClass: 'form-dialog-container',
            data: {
                title: this.page.data.modalFailed.title,
                text: this.page.data.modalFailed.text,
                img_url: '/assets/img/pages/auth/error.png',
                btn_text: this.page.data.modalFailed.btn,
            },
        });
    }
}
