import { Component, Inject, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiForm } from '../../../../../core/abstract/api-from';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { nicknameValidator } from 'src/app/core/validators/nickname.validator';
import { UserService } from 'src/app/data/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { nameValidator } from 'src/app/core/validators/name.validator';
import { nameLengthValidator } from 'src/app/core/validators/name-length.validator';
import { telegramValidator } from 'src/app/core/validators/telegram.validator';
import { socialValidator } from 'src/app/core/validators/social.validator';
import { PageModel } from 'src/app/data/models/page.models';
import { LangService } from 'src/app/core/services/lang.service';
import { telegramLengthValidator } from 'src/app/core/validators/telegram-length.validator';

@Component({
    selector: 'app-modal-edit',
    templateUrl: './modal-edit.component.html',
    styleUrls: ['./modal-edit.component.scss'],
})
export class ModalEditComponent extends ApiForm implements OnInit {
    get social(): string {
        switch (this.data.name) {
            case 'nickname':
            case 'fullName':
                if (this.langService.lang !== 'en') {
                    return this.data.page.data[this.data.name].toLowerCase();
                } else {
                    return this.data.page.data[this.data.name];
                }
            case 'twitterUrl':
                return 'Twitter';
            case 'facebookUrl':
                return 'Facebook';
            case 'tiktokUrl':
                return 'TikTok';
            case 'instagramUrl':
                return 'Instagram';
            case 'linkedinUrl':
                return 'LinkedIn';
            case 'telegram':
                return 'Telegram';
            default:
                return '';
        }
    }

    get label(): string {
        switch (this.data.name) {
            case 'nickname':
            case 'fullName':
                return this.data.page.data[this.data.name];
            case 'telegram':
                return 'ID';
            case 'twitterUrl':
            case 'facebookUrl':
            case 'tiktokUrl':
            case 'instagramUrl':
            case 'linkedinUrl':
                return 'URL';
            default:
                return '';
        }
    }

    get img(): string {
        switch (this.data.name) {
            case 'nickname':
            case 'fullName':
                return null;
            default:
                return this.data.name.replace('Url', '');
        }
    }

    get socialForError(): string {
        return this.social.charAt(0).toUpperCase() + this.social.slice(1);
    }

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        private matDialogRef: MatDialogRef<ModalEditComponent>,
        private langService: LangService,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            name: string;
            value: any;
            pageErrors: PageModel;
            page: PageModel;
        }
    ) {
        super(fb.group({}), false);
        this.reset = false;
        let value = '';

        switch (data.name) {
            case 'nickname':
                this.formGroup.addControl(
                    data.name,
                    this.fb.control(this.data.value, nicknameValidator())
                );
                break;
            case 'telegram':
                this.formGroup.addControl(
                    data.name,
                    this.fb.control(this.data.value)
                );
                this.control(data.name).addValidators(
                    telegramLengthValidator()
                );
                this.control(data.name).addValidators(telegramValidator());
                break;
            case 'fullName':
                this.formGroup.addControl(
                    data.name,
                    this.fb.control(this.data.value, [
                        nameLengthValidator(),
                        nameValidator(),
                    ])
                );
                break;
            case 'twitterUrl':
                value = this.data.value || 'https://twitter.com/';

                if (!value.includes('https://twitter.com/')) {
                    value = `https://twitter.com/${value}`;
                }

                this.formGroup.addControl(
                    data.name,
                    this.fb.control(
                        value,
                        socialValidator('https://twitter.com/')
                    )
                );
                break;
            case 'instagramUrl':
                value = this.data.value || 'https://instagram.com/';

                if (!value.includes('https://instagram.com/')) {
                    value = `https://instagram.com/${value}`;
                }

                this.formGroup.addControl(
                    data.name,
                    this.fb.control(
                        value,
                        socialValidator('https://instagram.com/')
                    )
                );
                break;
            case 'facebookUrl':
                value = this.data.value || 'https://facebook.com/';

                if (!value.includes('https://facebook.com/')) {
                    value = `https://facebook.com/${value}`;
                }

                this.formGroup.addControl(
                    data.name,
                    this.fb.control(
                        value,
                        socialValidator('https://facebook.com/')
                    )
                );
                break;
            case 'linkedinUrl':
                value = this.data.value || 'https://linkedin.com/';

                if (!value.includes('https://linkedin.com/')) {
                    value = `https://linkedin.com/${value}`;
                }

                this.formGroup.addControl(
                    data.name,
                    this.fb.control(
                        value,
                        socialValidator('https://linkedin.com/')
                    )
                );
                break;
            case 'tiktokUrl':
                value = this.data.value || 'https://tiktok.com/';

                if (!value.includes('https://tiktok.com/')) {
                    value = `https://tiktok.com/${value}`;
                }

                this.formGroup.addControl(
                    data.name,
                    this.fb.control(
                        value,
                        socialValidator('https://tiktok.com/')
                    )
                );
                break;
            default:
        }

        this.observeErrors(this.formGroup);
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
        const data = this.prepareData();

        return this.userService.update(data);
    }

    onRequestFailed(errorResponse: HttpErrorResponse): void {
        const error = {};
        error[errorResponse.error.message] = true;
        this.control(this.data.name).setErrors(error);
        this.btnSubmitted = true;
        this.syncErrors();
    }

    onRequestSuccess(value: any): void {
        super.onRequestSuccess(value);
        this.matDialogRef.close(this.prepareData());
    }

    modalClose() {
        this.matDialogRef.close();
    }

    prepareData() {
        let data = {};

        if (this.data.name !== 'nickname' && this.data.name !== 'telegram') {
            data['userDetail'] = this.formGroup.getRawValue();
        } else {
            data = this.formGroup.getRawValue();
        }

        return data;
    }
}
