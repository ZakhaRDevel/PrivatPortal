import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiForm } from '../../../../../core/abstract/api-from';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../../core/services/auth.service';
import { PageModel } from '../../../../../data/models/page.models';
import { CoreService } from '../../../../../core/services/core.service';
import { UserService } from 'src/app/data/services/user.service';
import { CodeInputComponent } from 'src/app/theme/components/code-input/code-input.component';
import { equalValidator } from 'src/app/core/validators/equal.validator';

@Component({
    selector: 'app-modal-password',
    templateUrl: './modal-password.component.html',
    styleUrls: ['./modal-password.component.scss'],
})
export class ModalPasswordComponent extends ApiForm implements OnInit {
    iconShowOldPassword: boolean = false;
    iconShowPassword: boolean = false;
    iconShowConfirmedPassword: boolean = false;
    isCopyPaste: boolean;
    step: string = 'step1';

    isSamePassword: boolean = false;

    code: string = '';

    @ViewChild('codeInput') codeInput: CodeInputComponent;

    get me() {
        return this.authService.currentUser;
    }

    constructor(
        private fb: FormBuilder,
        private matDialogRef: MatDialogRef<ModalPasswordComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            page: PageModel;
            pageErrors: PageModel;
        },
        private authService: AuthService,
        private userService: UserService,
        public coreService: CoreService
    ) {
        super(
            fb.group({
                oldPassword: fb.control('', {
                    validators: [Validators.required],
                }),
                password: fb.control('', {
                    validators: [Validators.required],
                }),
                confirmedPassword: fb.control('', {
                    validators: [Validators.required],
                }),
            })
        );

        this.reset = false;
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

    onSubmit() {
        this.isSamePassword = false;

        if (this.control('oldPassword').value) {
            this.userService
                .passwordCheck(this.formGroup.getRawValue())
                .subscribe(
                    (response) => {
                        response.messages.forEach((msg) => {
                            if (msg === 'samePassword') {
                                this.isSamePassword = true;
                            }

                            if (msg === 'wrongPassword') {
                                this.control('oldPassword').setErrors({
                                    wrongPassword: true,
                                });
                            }
                        });

                        this.validate();
                    },
                    (err) => {}
                );
        } else {
            this.validate();
        }
    }

    validate() {
        const isInvalid = this.checkForErrors();

        if (isInvalid) {
            this.btnSubmitted = true;
            this.syncErrors();
            return;
        }

        this.clearAllErrors();

        if (this.me.userSecurity.googleEnabled) {
            this.step = 'step2';
        } else {
            this.submit();
        }
    }

    clearAllErrors() {
        this.clearError(this.control('oldPassword'));
        this.clearError(this.control('password'));
        this.clearError(this.control('confirmedPassword'));

        this.control('oldPassword').setErrors({});
        this.control('password').setErrors({});
        this.control('confirmedPassword').setErrors({});

        this.control('oldPassword').updateValueAndValidity();
        this.control('password').updateValueAndValidity();
        this.control('confirmedPassword').updateValueAndValidity();
    }

    checkForErrors(): boolean {
        this.clearError(this.control('password'));
        this.clearError(this.control('confirmedPassword'));
        this.control('password').setErrors({});
        this.control('confirmedPassword').setErrors({});
        this.control('password').updateValueAndValidity();
        this.control('confirmedPassword').updateValueAndValidity();

        let isInvalid = false;

        const validator = new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'
        );

        if (
            this.control('oldPassword').value &&
            this.control('password').value &&
            this.isSamePassword
        ) {
            if (
                this.control('password').value !==
                    this.control('confirmedPassword').value &&
                this.control('confirmedPassword').value
            ) {
            } else if (
                this.control('password').value ===
                    this.control('confirmedPassword').value &&
                this.control('confirmedPassword').value
            ) {
            }

            this.control('password').setErrors({
                samePassword: true,
            });

            if (!this.control('oldPassword').hasError('wrongPassword')) {
                this.control('oldPassword').setErrors({
                    samePassword: true,
                });
            }
            return true;
        }

        if (this.control('password').value) {
            if (
                this.control('password').value &&
                this.control('confirmedPassword').value
            ) {
                if (
                    this.control('password').value !==
                    this.control('confirmedPassword').value
                ) {
                    this.control('password').setErrors({
                        passwordsNotMatch: true,
                    });

                    isInvalid = true;
                }
            }

            if (!isInvalid && !validator.test(this.control('password').value)) {
                this.control('password').setErrors({
                    password: true,
                });

                isInvalid = true;
            }
        }

        if (this.control('confirmedPassword').value) {
            if (
                this.control('password').value !==
                this.control('confirmedPassword').value
            ) {
                this.control('confirmedPassword').setErrors({
                    passwordsNotMatch: true,
                });

                isInvalid = true;
            }
        }

        if (
            !this.control('oldPassword').value ||
            !this.control('password').value ||
            !this.control('confirmedPassword').value
        ) {
            isInvalid = true;
        }

        if (this.control('oldPassword').hasError('wrongPassword')) {
            isInvalid = true;
        }

        return isInvalid;
    }

    getCode() {
        this.codeInput.submit();
    }

    setCode(code: string) {
        this.code = code;
        this.submit();
    }

    modalClose() {
        this.matDialogRef.close();
    }

    prepareRequest(): Observable<any> {
        const data = this.formGroup.getRawValue();

        if (this.me.userSecurity.googleEnabled) {
            data['code'] = this.code;
        }

        return this.userService.passwordChange(data);
    }

    onRequestSuccess(value: any): void {
        this.step = 'step3';
    }

    onRequestFailed(errorResponse: HttpErrorResponse): void {
        if (errorResponse?.error?.message === 'wrongCode') {
            this.codeInput.wrongCode = true;
        }
    }

    onToggleIconPassword(field: string) {
        if (field === 'oldPassword') {
            this.iconShowOldPassword = !this.iconShowOldPassword;
        } else if (field === 'password') {
            this.iconShowPassword = !this.iconShowPassword;
        } else if (field === 'confirmedPassword') {
            this.iconShowConfirmedPassword = !this.iconShowConfirmedPassword;
        }
    }
}
